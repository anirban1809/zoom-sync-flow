#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ReactHostingStack } from "../lib/cdk-stack";

// Determine environment from workflow or local `.env`
const appEnv = process.env.APP_ENV || "staging";
const awsRegion = process.env.AWS_REGION || "us-east-1";

const app = new cdk.App();

new ReactHostingStack(app, `ReactHostingStack-${appEnv}`, {
  envName: appEnv,
  env: { region: awsRegion },
});
