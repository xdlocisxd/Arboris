# 🌲 Guia de Self-Hosting: FloraTrack + Cloudflare Tunnel (Windows)

Este guia descreve como hospedar o FloraTrack na sua própria máquina de forma segura, usando o **Cloudflare Tunnel** para lidar com seu IP dinâmico e fornecer **HTTPS** automático.

## 🚀 Requisitos
1.  Um domínio adicionado e ativo no [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Acesso ao terminal (PowerShell/CMD).

---

## 🛠 Passo 1: Instalação do Cloudflared (No Windows)

O Cloudflare fornece um executável leve que cria a ponte entre seu PC e a rede deles.

1.  Baixe o `cloudflared` para Windows: [Download Link](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi).
2.  Instale o arquivo `.msi`.
3.  Abra o PowerShell como **Administrador** e valide a instalação:
    ```powershell
    cloudflared --version
    ```

---

## 🔑 Passo 2: Autenticação do Túnel

1.  Rode o comando para logar no Cloudflare:
    ```powershell
    cloudflared tunnel login
    ```
2.  Uma janela do navegador abrirá. Selecione o domínio que você comprou.
3.  Isso baixará um arquivo `cert.pem` necessário para os próximos comandos.

---

## 🏗 Passo 3: Criar o Túnel "FloraTrack-Server"

1.  Crie o túnel:
    ```powershell
    cloudflared tunnel create floratrack-server
    ```
    *Anote o **ID do Túnel** que aparecerá no terminal.*

2.  Crie o arquivo de configuração `config.yaml` na pasta `%USERPROFILE%\.cloudflared\` (ou na pasta raiz do projeto):

```yaml
tunnel: <SEU_TUNNEL_ID>
credentials-file: C:\Users\<SEU_USER>\.cloudflared\<SEU_TUNNEL_ID>.json

ingress:
  # Roteamento para o Frontend (Vite)
  - hostname: seu-dominio.com
    service: http://localhost:5173

  # Roteamento para o Backend (API)
  - hostname: api.seu-dominio.com
    service: http://localhost:3000

  - service: http_status:404
```

---

## 🌐 Passo 4: Configurar o DNS no Cloudflare

Agora precisamos "avisar" ao seu domínio que ele deve usar esse túnel.

```powershell
# Aponta o domínio principal para o túnel
cloudflared tunnel route dns floratrack-server seu-dominio.com

# Aponta o subdomínio da API para o túnel
cloudflared tunnel route dns floratrack-server api.seu-dominio.com
```

---

## 🏃 Passo 5: Iniciar o Túnel

Para rodar manualmente e testar:
```powershell
cloudflared tunnel run floratrack-server
```

---

## 🎯 Ajustes Importantes no Código (Critical)

Como agora você tem um domínio real e HTTPS, o FloraTrack precisa saber disso:

1.  **Frontend (`.env`)**:
    *   Mude a URL da API de `http://localhost:3000` para `https://api.seu-dominio.com`.
2.  **Backend (`CORS`)**:
    *   Garanta que o backend aceite requisições vindas de `https://seu-dominio.com`.

---

## 🛡 Segurança Extra (Dica de DevOps)

Para que o túnel inicie sempre que o Windows ligar:
1.  Use o comando: `cloudflared service install`.
2.  Isso transforma o túnel em um **Serviço do Windows**, rodando em silêncio no fundo.

---
*Este arquivo foi gerado para auxiliar no processo de deploy local do FloraTrack.*
