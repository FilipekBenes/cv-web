# Filip Beneš — CV Web

Moderní osobní CV a portfolio web postavený jako statická stránka s daty načítanými z YAML souboru.

Repozitář slouží jako zdrojový kód mého osobního webu:
**https://benesfilip.cz**

## O projektu

Tento web prezentuje moje:

- profesní zkušenosti
- vzdělání
- technické dovednosti
- projekty
- kontaktní informace
- odkazy na GitHub a LinkedIn

Obsah webu je oddělen od šablony a načítá se z `.yaml` souboru, díky čemuž je možné web jednoduše aktualizovat bez zásahů do HTML struktury.

## Technologie

Projekt je postavený pomocí:

- HTML
- CSS
- JavaScript
- YAML

## Struktura projektu

```text
.
├── index.html
├── styles.css
├── app.js
├── CNAME
├── assets/
└── data/
    └── cv.yaml
