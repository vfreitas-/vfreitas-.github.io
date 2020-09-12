---
title: "Trabalhando com Monorepo em Javascript"
date: "2020-09-17"
draft: true
description: "Configurando Lerna e Yarn workspaces"
---

![Multirepo vs Monorepo](./monorepo-multirepo.png)

Já ouviu falar do termo Monorepo? Ou Multirepo? São termos utilizados para definir dois modelos arquiteturais, onde resumidamente são formas de definirmos se iremos manter nosso código de varios projetos em apenas um repositorio versionado (git) ou em varios repositórios onde cada projeto terá o seu por exemplo.

Nesse post vamos falar sobre como criar o seu monorepo utilizando Javascript, não muito sobre quais são os casos indicados de cada arquitetura, ou seus prós e contras, porém vou deixar aqui uma comparação simples das duas abordagens:

## Multirepo

- Varios repositórios, normalmente 1 por projeto.
- Cada projeto tem o seu processo de deploy separado, com testes automatizados e builds apenas daquele projeto, sendo então mais rápidos e previsíveis.
- Cada repositório tem as suas dependencias com suas versões e é independente, porém normalmente isso leva a duplicamento de dependencias, ou a conflito e versões.
- Os times possuem mais autonomia, podendo realizar mudanças em seu repositório sem envolver outros times.

## Monorepo

- Um repositório para varios projetos e times.
- Como temos um repositório só é "mais simples" para novos membros se situarem.
- Os times tem menos autonomia, já que qualquer mudança pode impactar outros projetos, e boa parte das alterações devem ser alinhadas e planejadas entre os times.
- As dependencias dos projetos são unificadas e centralizadas, fazendo com que todos os projetos respeitem uma mesma versão de uma dependencia X, assim gerando menos conflitos e duplicamento de dependencias.

Tem varios outros pontos a se levar em conta na hora de escolher qual caminho deve ser tomado na sua empresa/projeto, lembre-se, não existe bala de prata ;), mas realizar uma escolha que faça sentido com a cultura da empresa, e dos times envolvidos, com certeza trará mais benefícios.

Agora vamos para a prática ;)

## Início do projeto

Para começar vamos criar um novo projeto, que será um monorepo e que terá a princípio duas bibliotecas. Para isso vamos utilizar duas ferramentas importantes, o [Lerna](https://lerna.js.org/) e o [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Cada uma delas tem o seu papel em nos fornecer funcionalidades para nos ajudar a gerenciar nosso monorepo, por isso devem ser usadas em conjunto, já que *uma não substitui a outra*.

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

Agora precisamos integrar o Yarn Workspaces com o Lerna, para isso precisamos adicionar duas configuracoes, e configurar o `package.json` das nossas duas bibliotecas!

package.json
```json
{
  // ...
  "private": true, // E dizemos pro Yarn que esse package.json princípal, é privado, e não deve ser publicado!
  "workspaces": { // Adicionamos essa entrada mapeando o mesmo caminho de packages que já veio
    "packages": [ // configurado pelo Lerna! Essa entrada é para avisar o Yarn workspaces, quais são os 
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
  "useWorkspaces": true, // E dizemos que o workspaces do yanr esta habilitado!
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

Agora vamos ver como publicar nossos pacotes e testa-los localmente.

...

https://verdaccio.org/docs/en/installation

## Por hoje é só 

Na parte 2 falaremos sobre como criar um processo automatizado de deploy (CI/CD) para o nosso monorepo, de forma que a gente possa publicar automaticamente nossas bibliotecas no npm (ou outro registro) depois de cada commit/pull request na master ;)

Obrigado por ler!