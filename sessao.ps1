Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $repoRoot

Write-Host "Sessao salva: cognoscere / glauco-framework / nvim" -ForegroundColor Cyan
Write-Host ""

Write-Host "Diretorio atual:" -ForegroundColor Yellow
Write-Host "  $repoRoot"
Write-Host ""

Write-Host "Arquivos locais importantes:" -ForegroundColor Yellow
Write-Host "  inicio.rb            -> entrada REPL com # %% e Gemma 4 do sistema"
Write-Host "  Gemfile/Gemfile.lock -> bundle JRuby local"
Write-Host "  public/              -> assets locais do projeto"
Write-Host ""

Write-Host "Repos/configs relacionados:" -ForegroundColor Yellow
Write-Host "  nvim config          -> $env:LOCALAPPDATA\nvim"
Write-Host "  workstation bootstrap-> $env:USERPROFILE\workstation-bootstrap"
Write-Host "  opencode config      -> $env:USERPROFILE\.config\opencode"
Write-Host "  glauco sistema       -> C:\glauco-framework"
Write-Host ""

Write-Host "Atalhos nvim adicionados/confirmados:" -ForegroundColor Yellow
Write-Host "  <leader>jx  -> run current notebook cell"
Write-Host "  <leader>jX  -> run cell and move"
Write-Host "  <leader>jA  -> run all notebook cells"
Write-Host "  <leader>jB  -> run current cell and cells below"
Write-Host "  <leader>jU  -> run cells above, including current cell"
Write-Host "  <leader>ji  -> MoltenInit jruby"
Write-Host ""

Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  .\codex-sessao.ps1"
Write-Host "  codex resume 019e88b8-0460-7df1-b40b-a6bd72352e72"
Write-Host "  nvim inicio.rb"
Write-Host "  jruby -S bundle install"
Write-Host "  jruby inicio.rb"
Write-Host "  git -C `"$env:LOCALAPPDATA\nvim`" status --short"
Write-Host "  git -C `"$env:USERPROFILE\workstation-bootstrap`" status --short"
Write-Host ""

Write-Host "Status git da pasta atual:" -ForegroundColor Yellow
git status --short
