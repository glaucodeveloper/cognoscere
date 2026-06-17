Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sessionId = "019e88b8-0460-7df1-b40b-a6bd72352e72"

Set-Location $repoRoot

Write-Host "Iniciando Codex em: $repoRoot" -ForegroundColor Cyan
Write-Host "Retomando sessao: $sessionId" -ForegroundColor Cyan
Write-Host ""
Write-Host "Contexto rapido:" -ForegroundColor Yellow
Write-Host "  Projeto: cognoscere"
Write-Host "  Entrada REPL: inicio.rb"
Write-Host "  Nvim config: $env:LOCALAPPDATA\nvim"
Write-Host "  Bootstrap: $env:USERPROFILE\workstation-bootstrap"
Write-Host "  Glauco sistema: C:\glauco-framework"
Write-Host ""
Write-Host "Atalhos nvim relevantes:" -ForegroundColor Yellow
Write-Host "  <leader>jU  -> run cells above, incluindo a atual"
Write-Host "  <leader>jB  -> run current cell and cells below"
Write-Host "  <leader>ji  -> MoltenInit jruby"
Write-Host ""

$codexCommand = Get-Command codex -ErrorAction SilentlyContinue
if ($null -eq $codexCommand) {
  throw "Comando 'codex' nao encontrado no PATH deste terminal."
}

& $codexCommand.Source resume $sessionId
