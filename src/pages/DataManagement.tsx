import { useState } from 'react';
import { Database, Download, Shield, Clock, Trash2, Activity, HardDrive, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function DataManagement() {
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [storageLocation, setStorageLocation] = useState('recordin');
  const [dataRegion, setDataRegion] = useState('mumbai');
  const [scheduledExportEnabled, setScheduledExportEnabled] = useState(false);
  const [requireSignIn, setRequireSignIn] = useState(true);
  const [zipPassword, setZipPassword] = useState(false);
  const [autoDeleteAudio, setAutoDeleteAudio] = useState(true);
  const [restoreDate, setRestoreDate] = useState<Date>();
  const [byokModalOpen, setByokModalOpen] = useState(false);
  const [backupsEnabled, setBackupsEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [backupDayOfWeek, setBackupDayOfWeek] = useState('monday');
  const [backupDayOfMonth, setBackupDayOfMonth] = useState('1');

  const pastExports = [
    { date: '8 Nov 2025', range: 'Last 30 days', format: 'Full ZIP', status: 'Ready', action: 'download' },
    { date: '1 Nov 2025', range: 'Oct 2025', format: 'PDF', status: 'Ready', action: 'download' },
  ];

  const activityLog = [
    { time: '10:12', action: 'Export created', by: 'You', details: '12 meetings • PDF' },
    { time: '09:45', action: 'Settings changed', by: 'You', details: 'Retention policy updated' },
    { time: 'Yesterday', action: 'Backup completed', by: 'System', details: 'Daily backup' },
  ];

  const handleStorageChange = () => {
    setStorageModalOpen(false);
    toast({
      title: "Storage location saved",
      description: "Changes take effect for new meetings.",
    });
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-12);
    toast({
      title: "Password generated",
      description: password,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground mt-1">
          Control where your meeting data lives, how long we keep it, and how to export it.
        </p>
      </div>

      {/* Storage Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            <CardTitle>Storage</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Where your data is stored</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Recordin secure cloud</span>
              <Button variant="outline" size="sm" onClick={() => setStorageModalOpen(true)}>
                Change
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Usage</Label>
              <span className="text-sm font-medium">18.2 GB of 200 GB</span>
            </div>
            <Progress value={9.1} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Audio 8.5 GB • Transcripts 2.1 GB • Notes 0.3 GB • Attachments 7.3 GB
            </p>
            <Button variant="outline" size="sm">Free up space</Button>
          </div>

          <div className="space-y-2">
            <Label>Data region</Label>
            <Select value={dataRegion} onValueChange={setDataRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Asia South Mumbai</SelectItem>
                <SelectItem value="singapore">Asia Southeast Singapore</SelectItem>
                <SelectItem value="us-east">US East</SelectItem>
                <SelectItem value="eu-west">EU West</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Used for all new meetings. Moving regions does not move existing files.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <CardTitle>Export</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Quick export</Label>
            <div className="flex gap-2 flex-wrap">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="zip">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zip">Full bundle ZIP</SelectItem>
                  <SelectItem value="pdf">Transcripts PDF</SelectItem>
                  <SelectItem value="markdown">Notes Markdown</SelectItem>
                  <SelectItem value="mp3">Audio MP3</SelectItem>
                </SelectContent>
              </Select>
              <Button>Create export</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Scheduled export</Label>
              <Switch checked={scheduledExportEnabled} onCheckedChange={setScheduledExportEnabled} />
            </div>
            {scheduledExportEnabled && (
              <div className="space-y-3 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label className="text-sm">Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Delivery</Label>
                  <Select defaultValue="email">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email download link</SelectItem>
                      <SelectItem value="s3">Upload to S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm">Save</Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Past exports</Label>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastExports.map((exp, i) => (
                    <TableRow key={i}>
                      <TableCell>{exp.date}</TableCell>
                      <TableCell>{exp.range}</TableCell>
                      <TableCell>{exp.format}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{exp.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Download</Button>
                          <Button variant="ghost" size="sm">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backups Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Backups</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your meeting data</p>
            </div>
            <Switch checked={backupsEnabled} onCheckedChange={setBackupsEnabled} />
          </div>

          {backupsEnabled && (
            <div className="space-y-4 pl-4 border-l-2">
              <div className="space-y-2">
                <Label>Backup frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {backupFrequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Day of week</Label>
                  <Select value={backupDayOfWeek} onValueChange={setBackupDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {backupFrequency === 'monthly' && (
                <div className="space-y-2">
                  <Label>Day of month</Label>
                  <Select value={backupDayOfMonth} onValueChange={setBackupDayOfMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    For months with fewer days, backup runs on the last day
                  </p>
                </div>
              )}

              <Button size="sm">Save backup settings</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Encryption at rest</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Managed by Recordin</span>
              <Button variant="outline" size="sm" onClick={() => setByokModalOpen(true)}>
                Advanced
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Require sign-in for all downloads</Label>
              <Switch checked={requireSignIn} onCheckedChange={setRequireSignIn} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Add password to exported ZIPs</Label>
              <Switch checked={zipPassword} onCheckedChange={setZipPassword} />
            </div>

            {zipPassword && (
              <div className="space-y-2 pl-4 border-l-2">
                <Label className="text-sm">ZIP Password</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Enter password" />
                  <Button variant="outline" onClick={generatePassword}>
                    Generate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Retention Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Retention</CardTitle>
          </div>
          <CardDescription>Clear, human defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Audio recordings</Label>
              <Select defaultValue="90days">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="90days">90 days</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
                  <SelectItem value="forever">Keep forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Next cleanup on 12 Nov 2025</p>
            </div>

            <div className="space-y-2">
              <Label>Transcripts</Label>
              <Select defaultValue="1year">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90days">90 days</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
                  <SelectItem value="2years">2 years</SelectItem>
                  <SelectItem value="forever">Keep forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Next cleanup on 12 Nov 2025</p>
            </div>

            <div className="space-y-2">
              <Label>Notes and action items</Label>
              <Select defaultValue="forever">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 year</SelectItem>
                  <SelectItem value="2years">2 years</SelectItem>
                  <SelectItem value="forever">Keep forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Next cleanup on 12 Nov 2025</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Delete original audio after transcription</Label>
              <p className="text-xs text-muted-foreground">Saves space. Transcripts and notes stay.</p>
            </div>
            <Switch checked={autoDeleteAudio} onCheckedChange={setAutoDeleteAudio} />
          </div>

          <Button>Apply changes</Button>
        </CardContent>
      </Card>

      {/* Delete and Restore Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            <CardTitle>Delete and Restore</CardTitle>
          </div>
          <CardDescription>Safe, reversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleted items can be restored for 7 days.
          </p>

          <div className="flex gap-2">
            <Button variant="destructive">Delete selected meetings</Button>
            <Button variant="outline">Restore deleted items</Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Activity Log</CardTitle>
          </div>
          <CardDescription>Transparency without complexity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search by person or action" className="flex-1 min-w-[200px]" />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLog.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{log.time}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.by}</TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button variant="outline">Download CSV</Button>
        </CardContent>
      </Card>

      {/* Storage Location Modal */}
      <Dialog open={storageModalOpen} onOpenChange={setStorageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Storage Location</DialogTitle>
            <DialogDescription>
              New files will be saved to the new location. Existing files stay where they are.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Storage Location</Label>
              <Select value={storageLocation} onValueChange={setStorageLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recordin">Recordin secure cloud</SelectItem>
                  <SelectItem value="aws">My AWS S3</SelectItem>
                  <SelectItem value="azure">My Azure Blob</SelectItem>
                  <SelectItem value="gcp">My Google Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {storageLocation !== 'recordin' && (
              <>
                <div className="space-y-2">
                  <Label>Bucket or Container</Label>
                  <Input placeholder="my-bucket-name" />
                </div>
                <div className="space-y-2">
                  <Label>Path Prefix</Label>
                  <Input placeholder="meetings/" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStorageModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStorageChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BYOK Modal */}
      <Dialog open={byokModalOpen} onOpenChange={setByokModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bring Your Own Key (BYOK)</DialogTitle>
            <DialogDescription>
              Use your own encryption key for data at rest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key ID</Label>
              <Input placeholder="arn:aws:kms:..." />
            </div>
            <Button variant="outline">Validate key</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setByokModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setByokModalOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
