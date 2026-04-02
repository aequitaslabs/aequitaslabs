$path = 'c:\Users\perpl\aequitaslabs-new\protocol-design.html'
$content = [System.IO.File]::ReadAllText($path)
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
