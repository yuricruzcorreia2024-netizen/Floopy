# Floppy

Frontend de streaming em HTML/CSS/JS para GitHub Pages, integrado à SugoiAPI.

## 1. Rodar a SugoiAPI localmente

```bash
git clone https://github.com/yzPeedro/SugoiAPI.git sugoiapi
cd sugoiapi
docker compose up -d
```

A API fica em:

`http://localhost:1010`

## 2. Configurar o Floppy

Edite `js/config.js`:

```js
window.FLOPPY_CONFIG = {
  API_URL: "http://localhost:1010"
};
```

## 3. Testar

Abra o Floppy no mesmo computador da SugoiAPI e use uma URL como:

`player.html?id=naruto&season=1&episode=1`

O player interpreta a resposta da API no formato:

`data[].episodes[].episode`

e cria botões para os providers disponíveis.

### Importante para GitHub Pages

`localhost` só funciona no computador que está executando a SugoiAPI. Para visitantes do GitHub Pages, publique a SugoiAPI em um servidor HTTPS e coloque essa URL em `js/config.js`.
