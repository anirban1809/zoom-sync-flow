import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  CfnOutput,
  Tags,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

interface ReactHostingStackProps extends StackProps {
  envName: string;
}

export class ReactHostingStack extends Stack {
  constructor(scope: Construct, id: string, props: ReactHostingStackProps) {
    super(scope, id, props);

    const { envName } = props;

    // Tag everything for clarity
    Tags.of(this).add("Environment", envName);

    // Use environment name to isolate resources
    const siteBucket = new s3.Bucket(this, `${envName}-ReactSiteBucket`, {
      bucketName: `${envName}-react-site-${this.account}-${this.region}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      autoDeleteObjects: true,
      removalPolicy:
        envName === "production" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY, // keep prod, destroy staging
    });

    const originAccess = new cloudfront.OriginAccessIdentity(
      this,
      `${envName}-OAI`,
      { comment: `Access for CloudFront (${envName})` }
    );

    siteBucket.grantRead(originAccess);

    const certificate = Certificate.fromCertificateArn(
      this,
      `${envName}-Certificate`,
      "arn:aws:acm:us-east-1:779844646698:certificate/abbdc0d1-5d22-42f4-9b18-606f985db085"
    );

    const distribution = new cloudfront.Distribution(
      this,
      `${envName}-CloudFrontDist`,
      {
        defaultBehavior: {
          origin: new origins.S3Origin(siteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: ["staging.luminote.ai"],
        certificate,
        defaultRootObject: "index.html",
        comment: `React Hosting (${envName})`,
        priceClass:
          envName === "production"
            ? cloudfront.PriceClass.PRICE_CLASS_ALL
            : cloudfront.PriceClass.PRICE_CLASS_100,
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: Duration.minutes(5),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: Duration.minutes(5),
          },
        ],
      }
    );

    const backendFn = new lambda.Function(this, `${envName}-BackendFn`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async () => ({
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            env: "${envName}",
            message: "Hello from ${envName} backend!"
          }),
        });
      `),
      timeout: Duration.seconds(5),
    });

    const api = new apigw.LambdaRestApi(this, `${envName}-Api`, {
      handler: backendFn,
      proxy: true,
      deployOptions: {
        stageName: envName,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
      },
    });

    // Deploy the React build folder (relative to repo root)
    new s3deploy.BucketDeployment(this, `${envName}-DeployReact`, {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Stack outputs
    new CfnOutput(this, "SiteURL", {
      value: `https://${distribution.domainName}`,
    });

    new CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}
