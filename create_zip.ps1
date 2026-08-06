
  $source = 'C:\Users\KAVIN\Downloads\stocktrader-mern-app-completed'
  $zipFile = 'C:\Users\KAVIN\Downloads\stocktrader-mern-app.zip'
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [System.IO.Compression.ZipFile]::Open($zipFile, 'Create')
  Get-ChildItem -Path $source -Recurse | Where-Object { -not $_.PSIsContainer -and $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*build*' -and $_.FullName -notlike '*.git*' } | ForEach-Object {
    $rel = $_.FullName.Substring($source.Length + 1)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel)
  }
  $archive.Dispose()
  