# Floppy
Frontend de streaming em HTML, CSS e JavaScript puro, pronto para GitHub Pages.

## 1. Configurar a API
Abra `js/config.js` e troque:

`https://SUA-API-AQUI.com`

pela URL pública da sua SugoiAPI.

A integração usa o endpoint:

`GET /episode/{slug}/{season}/{episodeNumber}`

## 2. Catálogo
O arquivo `data/catalog.json` controla o catálogo visual. Cada item possui `id`, `title`, `slug`, `year`, `status`, `genres`, `episodes`, `cover`, `banner` e `description`.

O `slug` precisa ser compatível com o slug esperado pela SugoiAPI.

## 3. GitHub Pages
Envie toda a pasta para um repositório e ative GitHub Pages usando a branch principal e a pasta raiz.

## Observação sobre CORS
O navegador precisa conseguir acessar a API diretamente. Se a SugoiAPI não enviar `Access-Control-Allow-Origin`, o GitHub Pages não conseguirá fazer a requisição. Nesse caso, configure CORS na API.
