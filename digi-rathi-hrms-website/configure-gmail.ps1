param([string]$Sender,[string]$WebsiteUrl)
$ErrorActionPreference='Stop'
if (-not $Sender) { $Sender=Read-Host 'Gmail or Google Workspace sender address' }
if (-not $WebsiteUrl) { $WebsiteUrl=Read-Host 'Website URL employees can reach (not localhost)' }
if ($Sender -notmatch '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$') { throw 'Enter a valid sender email address.' }
$website=[Uri]$WebsiteUrl
if (-not $website.IsAbsoluteUri -or $website.Scheme -notin @('https','http') -or $website.UserInfo -or $website.Query -or $website.Fragment -or $website.AbsolutePath -ne '/' -or $website.Host -in @('localhost','127.0.0.1','::1','0.0.0.0') -or $website.Host.EndsWith('.example')) { throw 'Enter the real root website URL employees can reach. A demo URL cannot be used for live welcome emails.' }
$secret=Read-Host 'Google app password (hidden; not your normal Google password)' -AsSecureString
$secretPointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $appPassword=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer) -replace '\s',''
  if ($appPassword -notmatch '^[A-Za-z0-9]{16}$') { throw 'Enter the 16-character Google app password.' }
  $configPath=Join-Path $PSScriptRoot '.env.local'
  $content="SMTP_USER=$Sender`nSMTP_PASSWORD=$appPassword`nHRMS_PUBLIC_URL=$($website.AbsoluteUri)`nHRMS_COMPANY_NAME=Digi Rathi`n"
  [IO.File]::WriteAllText($configPath,$content,[Text.UTF8Encoding]::new($false))
  $identity=[Security.Principal.WindowsIdentity]::GetCurrent().User
  $acl=[Security.AccessControl.FileSecurity]::new()
  $acl.SetOwner($identity)
  $acl.SetAccessRuleProtection($true,$false)
  $acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($identity,'FullControl','Allow'))
  Set-Acl -LiteralPath $configPath -AclObject $acl
  Write-Output 'Gmail configuration saved privately. Restart the HRMS server to use it.'
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
  $appPassword=$null
  $content=$null
  $secret.Dispose()
}
