
# Drama news API


## Autores

- [@WillianAlves](https://github.com/willianOliveiraMX)


Olá, obrigado por verificar a API Drama news. Seu obejtivo é prover todas as informações necessárias para renderizar o conteúdo do site Drama News.

## Como rodar o projeto:

Clone o projeto em sua máquina. Será necessário ter o docker instalado. Rode os comandos na sequência:

- 1
```javascript
docker compose build --no-cache
```

- 2
```javascript
docker compose up
```


## Documentação da API

#### Retorna os artigos de acordo com os parâmetros

```http
  GET /api/v1/articles
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `limit` | `number` | **Obrigatório**. Quantidade de itens que serão retornados |
| `offset` | `number` | **Obrigatório**. De onde começará a ser contado |
| `token Bearer` | `string` | **Obrigatório**. Cada cliente da aplicação possui um token fixo para acessar |

#### Retorna um artigo por slug

```http
  GET /api/v1/articles/slug
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `slug` | `string` | **Obrigatório**. Slug ou endereço do artigo que está sendo pesquisado |
| `token Bearer` | `string` | **Obrigatório**. Cada cliente da aplicação possui um token fixo para acessar |

#### Retorna uma lista de artigos por categoria

```http
  GET /v1/articles/category
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `type` | `string` | **Obrigatório**. Categoria a ser pesquisada |
| `token Bearer` | `string` | **Obrigatório**. Cada cliente da aplicação possui um token fixo para acessar |
