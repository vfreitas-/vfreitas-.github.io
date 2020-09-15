---
title: "Trabalhando com Monorepo em Javascript"
date: "2020-09-17"
draft: true
description: "Configurando Lerna e Yarn workspaces"
---

![Multirepo vs Monorepo](./monorepo-multirepo.png)

Já ouviu falar do termo Monorepo? Ou Multirepo? São termos utilizados para definir dois modelos arquiteturais, onde resumidamente são formas de definirmos se iremos manter nosso código de vários projetos em apenas um repositório versionado (git) ou em vários repositórios onde cada projeto terá o seu por exemplo.

Nesse post vamos falar sobre como criar o seu monorepo utilizando Javascript, não muito sobre quais são os casos indicados de cada arquitetura, ou seus prós e contras, porém vou deixar aqui uma comparação simples das duas abordagens:

## Multirepo

- Vários repositórios, normalmente 1 por projeto.
- Cada projeto tem o seu processo de deploy separado, com testes automatizados e builds apenas daquele projeto, sendo então mais rápidos e previsíveis.
- Cada repositório tem as suas dependências com suas versões e é independente, porém normalmente isso leva a duplicidade de dependências, ou a conflito de versões.
- Os times possuem mais autonomia, podendo realizar mudanças em seu repositório sem envolver outros times.

## Monorepo

- Um repositório para vários projetos e times.
- Como temos um repositório só é "mais simples" para novos membros se situarem.
- Os times tem menos autonomia, já que qualquer mudança pode impactar outros projetos, e boa parte das alterações devem ser alinhadas e planejadas entre os times.
- As dependências dos projetos são unificadas e centralizadas, fazendo com que todos os projetos respeitem uma mesma versão de uma dependência X, assim gerando menos conflitos e duplicamento de dependências.

Tem vários outros pontos a se levar em conta na hora de escolher qual caminho deve ser tomado na sua empresa/projeto, lembre-se, não existe bala de prata ;), mas realizar uma escolha que faça sentido com a cultura da empresa, e dos times envolvidos, com certeza trará mais benefícios.

Agora vamos para a prática ;)

## Início do projeto

Para começar vamos criar um novo projeto, que será um monorepo e que terá a princípio duas bibliotecas. Para isso vamos utilizar duas ferramentas importantes, o [Lerna](https://lerna.js.org/) e o [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Cada uma delas tem o seu papel em nos fornecer funcionalidades para nos ajudar a gerenciar nosso monorepo, por isso devem ser usadas em conjunto, já que *uma não substitui a outra*.

Vamos falar um pouco dos dois antes de partir pro código:

### Yarn Workspaces

O Yarn é um gerenciador de dependências assim como o npm, e possui a funcionalidade de workspaces que nos permite gerenciar repositórios que são monorepos. Basicamente o Yarn Workspaces fica responsável por gerenciar as dependências do projeto e fazer a distinção de quais dependências são utilizadas por qual projeto dentro do monorepo, e quais são globais e servem para o projeto como um todo. Cuidando então da parte mais de "baixo" de um monorepo.

>A funcionalidade de workspaces do Yarn, também está sendo criada pelo time do NPM, e vai estar disponível no [NPM@7.0.0](https://blog.npmjs.org/post/617484925547986944/npm-v7-series-introduction). Depois que ele for lançado irei atualizar esse artigo ou criar um novo comparando com o Yarn no uso com monorepos.

### Lerna

Já o Lerna é uma ferramenta que cuida da parte mais de "cima" de um monorepo, trazendo facilidades ao gerenciar um monorepo, e quando utilizado em conjunto com o Yarn Workspaces, ele deixa todo o trabalho de gerenciamento de dependências com o Yarn, e cuida mais da parte de execução de comandos, e publicação desses pacotes, assim como gerenciando a versão (utilizando [semver](https://semver.org/)) de cada projeto, seja com uma versão única para todos, ou diferente.

Agora para começar vamos instalar os dois:

>O Yarn possui seus próprios métodos de [instalação dependendo do sistema operacional](https://classic.yarnpkg.com/en/docs/install)
> Para manter a simplicidade iremos instalar da forma mais simples, apesar de [não recomendada pelo Yarn](https://classic.yarnpkg.com/en/docs/install/#alternatives-stable)

```bash
$ npm install -g yarn
$ npm install -g lerna
```

Depois podemos criar nosso projeto usando a CLI do Lerna:

```bash
$ lerna init
```

Agora precisamos integrar o Yarn Workspaces com o Lerna, para isso precisamos adicionar duas configurações, e configurar o `package.json` das nossas duas bibliotecas!

package.json
```json
{
  // ...
  "private": true, // E dizemos pro Yarn que esse package.json princípal, é privado, e não deve ser publicado
  "workspaces": { // Adicionamos essa entrada mapeando o mesmo caminho de packages que já veio
    "packages": [ // configurado pelo Lerna. Essa entrada é para avisar o Yarn workspaces, quais são os 
      "packages/**" // seus workspaces
    ]
  },
  // ...
}

```

lerna.json
```json
{
  "npmClient": "yarn", // Indicamos ao Lerna que estamos usando o yarn invés do npm
  "useWorkspaces": true, // E dizemos que o workspaces do yarn esta habilitado
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

E depois criamos dois `packages` que serão nossas bibliotecas, e adicionamos um `package.json` para cada:

![Imagem das duas bibliotecas novas](./packages-novos.png)

packages/log-lib/package.json
```json
{
  "name": "@my-monorepo/log-lib",
  "version": "1.0.0"
}
```

packages/math-lib/package.json
```json
{
  "name": "@my-monorepo/math-lib",
  "version": "1.0.0"
}
```

E depois rodamos o comando referente ao `npm install` do Yarn, para que ele possa identificar nossos workspaces, e baixar tudo que for preciso.

```bash
$ yarn
```

Agora se olharmos no `node_modules` do nosso projeto, podemos ver que o Yarn já cuidou de criar as referencias aos nossas duas bibliotecas, e deixar disponível para caso outro projeto dentro do monorepo queira utiliza-lo:

![Nossas bibliotecas na node_modules](./node-modules-com-packages.png)

## Publicando nossos pacotes

Agora vamos ver como publicar nossos pacotes e testa-los localmente, e depois como publica-los diretamente no NPM ou em algum outro registro privado (comum em grandes empresas).

Para publicar nossos pacotes localmente vamos utilizar o [Verdaccio](https://verdaccio.org/docs/en/installation) que é um registro privado feito com NodeJs, de fácil configuração e que nos permite adicionar ou buscar pacotes pelo NPM, da mesma forma que buscamos e adicionamos pacotes no próprio registro do NPM.

> *O que é um registro?* É basicamente um repositório de pacotes/bibliotecas que possui uma API para buscar/adicionar pacotes, é compatível com o [semver](https://semver.org/)


## Por hoje é só 

Na parte 2 falaremos sobre como criar um processo automatizado de deploy (CI/CD) para o nosso monorepo, de forma que a gente possa publicar automaticamente nossas bibliotecas no npm (ou outro registro) depois de cada commit/pull request na master ;)

Obrigado por ler!