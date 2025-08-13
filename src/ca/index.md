# Plantilla d'exemple VitePress

Benvingut! Aquesta pàgina és una plantilla de demostració que mostra la varietat d'elements que pots utilitzar en la teua documentació amb VitePress.

---

## Títols i seccions

## Títol nivell 1

## Títol nivell 2

### Títol nivell 3

---

## Llistes

- Element de llista
- Un altre element
  - Sub-element

1. Element numerat
2. Segon element

---

## Taula

| Nom          | Tipus        | Valor        |
|--------------|--------------|-------------|
| edat         | numèric      | 30          |
| IVA          | numèric      | 0.21        |
| DOMINI_GMAIL | alfanumèric  | "gmail.com" |

---

## Bloc de codi

```plaintext
- Nom de la dada: edat
- Tipus de dada: numèric
- Valor de la dada: 30
```

```md
<script setup>
import { useData } from 'vitepress'
const { theme, page, frontmatter } = useData()
</script>
```

---

## Imatge

![Logo CC](/img/logo-cc.png){logo}

---

## Bloc de cita

> Exemple de cita: "Els programes són com receptes detallades que li diuen a l'ordinador exactament què fer."

---

## Bloc d'informació

::: info
Aquesta és una caixa d'informació.
:::

::: tip
Aquesta és una caixa de consell.
:::

::: warning
Aquesta és una caixa d'avís.
:::

::: danger
Aquesta és una caixa de perill.
:::

---

## Detalls expandibles

::: details Exemple de detalls
Aquesta secció es pot expandir per mostrar més informació.
:::

---

## Pestanyes

::: tabs
== Pestanya 1

Aquesta secció es per a mostrar informació relacionada amb la pestanya 1.

== Pestanya 2

Aquesta secció es per a mostrar informació relacionada amb la pestanya 2.

:::

---

## Enllaç a la documentació de l'API

Consulta la [documentació de l'API de VitePress](https://vitepress.dev/reference/runtime-api#usedata).

---

Aquesta plantilla mostra la majoria d'elements que pots utilitzar en la teua documentació. Pots eliminar o modificar lliurement aquest contingut.