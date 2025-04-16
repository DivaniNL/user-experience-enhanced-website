# DJ-overzicht Mediahuis

## Beschrijving
Voor deze sprint heb ik een DJ overzicht gemaakt waar je DJ's kan liken en unliken op basis van een gebruikersnaam.
De site is hier te bekijken:
[https://server-side-rendering-server-side-website-g630.onrender.com/](https://the-web-is-for-everyone-interactive-cq43.onrender.com/station/Radio%20Veronica/djs)


## Gebruik


In onderstaande video is het te zien hoe je kan inloggen, kan liken en kan unliken. (voor unliken hoef je neit te refreshen, maar hier wilde ik laten zien dat de likes per persoon bleven staan)


https://github.com/user-attachments/assets/fb938c03-15d1-4e5e-b23d-2c64c988c3ca



Mijn User story:
Als een bezoeker van de website, wil ik per radiostation de DJ’s kunnen liken en unliken, zodat ik mijn favoriete DJ’s kan ondersteunen en anderen kan zien welke DJ’s populair zijn.


## Ontwerpkeuzens

Ik heb een ontwerp gemaakt waar het DJ overzicht zal passen met de rest van de styling. 
Ik heb tijdens het ontwerpen rekening gehouden met toegangkelijkheid door voldoende feedback en feedforward toe te passen. 

https://github.com/user-attachments/assets/1d89578b-120c-4a8b-9d25-e5b07483362b

In dit ontwerp heb ik **Feedforward** toegepast door een label toe te voegen aan de (Un)Like button.

In dit ontwerp heb ik **Feedback** toegepast op meerdere manieren.
1. Door de label te veranderen
2. Door de achtergrondkleur en tekstkleur van de knop te veranderen als je hem geliked hebt t.o.v als je de DJ niet geliked hebt.
3. Notificatiebalk boven (in video onder **Gebruik** is dit te zien)


## Kenmerken

### Progressive Enhancement

In dit project heb ik de gedachtegang van Progressive Enhancement toegepast. 
Progressive-enhancement is geen techniek, maar meer een strategie, waarmee je ervoor kunt zorgen dat je website functioneel is voor iedereen. Extra functies worden toegepastr als browsers dit ondersteunen. 
Zo niet, valt de browser terug naar een werkende versie.
Tijdens Progressive Enhancement sta je dus stil bij de Core Functionality van een element. Deze meot altijd werken.
Hieronder leg ik uit hoe ik elke stap heb nageleefd:


**Bepaal de core Functionality**

In het DJ overzicht was de core functionaliteit om de DJ's te bekijken, en DJ's te liken en Unliken

**HTML en minimale CSS**

Ik ben gaan kijken welke HTML-element(en) de core-functionaliteit vereist om een zo semantisch mogelijke oplossign te bieden voor dit probleem.
Ik heb de like functie gemaakt middels een `<form>` element. De DJ kaarten in het overzicht zijn instanties van een `<article>`.
Hierna heb ik wat kleuren van de huisstijl gebruikt om een one-column layout te bouwen.

**Enhancement**

Hierna heb ik met CSS animaties gemaakt en met JS front-end scripting gebruikt om, mits Fetch ondersteund wordt, de Likes/Unlikes uit te laten voeren zonder page-refresh

### NodeJS
Met Node kan je server-side applicaties bouwen met JavaScript. In dit project wordt Node.js gebruikt om een webserver te draaien die de applicatie bedient.

### Express
Express is een framework voor Node.js dat functies biedt voor het bouwen van sites. In dit project wordt Express gebruikt om routes te definiëren en HTTP-verzoeken(post,get,delete) af te handelen.

### Liquid
Liquid is een template engine voor JavaScript en Ruby. Het wordt gebruikt om HTML te genereren met dynamische data. In dit project wordt Liquid gebruikt om de HTML-pagina's te renderen met data die wordt opgehaald van de whois FDND API.

### Client Side Scripting
In dit project is Client Side Scripting gebruikt om ervoor te zorgen dat post en delete-request uitge3voerd kunnen worden zonder dat een page-refresh nodig is.

### Projectstructuur
Het project heeft de volgende structuur:
- server.js: Dit is het hoofdbestand van de server. Hier worden de Express-applicatie en routes gedefinieerd.
- views: Bevat de Liquid templates voor de HTML-pagina's.
- public: Bevat de statische bestanden zoals CSS, JavaScript en afbeeldingen.

### Routes
De routes worden gedefinieerd in server.js. Hier zijn enkele belangrijke routes:

- `GET /`: De oude hoofdpagina van Mediahuis (niet veranderd)
- `GET /station/:name/djs{/likeStatus/:likeStatus}`: Haalt de DJ's op per radiostation. Geeft een eventuele Likestatus mee (POST request statuscode)
De naam van het radiostation is encrypted in de url. Zoals Radio%20Veronica. (dit is :name)
Een link kan dan zijn:
/station/Radio%20Veronica/djs

### Data ophalen en posten

**GET**
De data wordt opgehaald van de Directus API met behulp van `fetch`. Bijvoorbeeld, in de route `GET /` wordt de lijst van alle shows van het huidige station ingeladen. Hieruit worden alle gekoppelde Users gehaald om zo een overzicht te bouwen

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/server.js#L229-L232

Hierna worden alle Likes opgehaald en worden deze toegevoegd aan de JSON per User:

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/server.js#L255-L271


**POST (Like)**
Als een DJ wordt geliked wordt er een Like toegevoegd aan de mh_messages API endpoint

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/server.js#L317-L339


**DELETE (Unlike)**

Als er een DJ wordt ge-unliked wordt de like van de aangeklikte DJ van de ingelogde user verwijderd:

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/server.js#L344-L371


### HTML renderen met data
De HTML wordt gerenderd met Liquid templates. Bijvoorbeeld, in de route `GET /` worden de DJ's geladen met de volgende code

**deejays.liquid:**

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/views/deejays.liquid#L30-L32

**dj.liquid**

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/views/partials/dj.liquid#L1-L36

### UI states:

Ik heb de volgende states ontworpen en gebouwd:

#### Loading state

Ontwerp: (SVG + blur)
![image](https://github.com/user-attachments/assets/4a45d005-e711-4df2-8460-1d138cd6e41f)
Tijdens de Loading state is een Pulse animatie te zien (dit is een animated gif). Als de loading state ingaat gaat het oude nummer omhoog of omlaag (afhankelijk van of je liked of unliked)

Ik heb tijdens de bouwfase bedacht om de tekst en de button geen blur te geven, en om een rustigere animatie te kiezen t.o.v. het ontwerp.

Hieronder een video van de aniamtie:


https://github.com/user-attachments/assets/ac3e9f97-bc94-41dc-a5ce-dde4f8c31350


#### Ideal state op element
Tijdens de Ideal state komt het nieuwe nummer insliden van boven of onder (afhankelijk van of je liked of unliked)

Hieronder een video van de animaties:

https://github.com/user-attachments/assets/6fbe8ca5-b04b-4048-b186-38575839fa9d

Hieronder is te zien hoe ik dat gedaan heb in code:

**JS**

Verwijder alle classes om mee te beginnen en voeg juiste class toe (like of unlike|)
https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/862b186b430d535002b9a67db90443bc7cc58700/views/deejays.liquid#L67-L88

Na de request, verwijder loading state classes

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/862b186b430d535002b9a67db90443bc7cc58700/views/deejays.liquid#L119-L123

Voeg finished states toe om de animatie af te ronden:

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/862b186b430d535002b9a67db90443bc7cc58700/views/deejays.liquid#L130-L138


**CSS**

Hieronder de keyframe animateis om het nummer in en uit te sliden:

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/862b186b430d535002b9a67db90443bc7cc58700/public/css/deejays.css#L297-L347


#### Error state (Edited)
Als de Like/Unlike niet goed uitgevoerd wordt verschijnt een errorbalk met foutmelding

https://github.com/user-attachments/assets/943aa4ae-2f1a-4199-be48-8435eb6c3a3b

Hieronder is te zien hoe ik dit in Code heb gedaan:

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/862b186b430d535002b9a67db90443bc7cc58700/views/deejays.liquid#L90-L103

## Empty state (DJ overzicht)

Als er geen DJ's gekoppeld zijn aan dit radiostation komt er een Empty state:

https://github.com/user-attachments/assets/08b95c2c-d1e5-47b8-b323-62bd86212582

Hieronder is te zien hoe ik dat in code heb gedaan: (ELSE)

https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality/blob/5024b4c1ab8eecce5c2a2b83023c98112532857c/views/deejays.liquid#L28-L37


## Installatie

Om dit project lokaal te installeren en te draaien, volg je de onderstaande stappen:

### Vereisten
- Node.js (versie 14 of hoger)
- npm (Node Package Manager, wordt meestal samen met Node.js geïnstalleerd)
- GitHub Desktop (niet per se nodig, maar werkt fijn)

### Stappen

1. **Clone de repository**
    - Ga naar de repository: [https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality](https://github.com/DivaniNL/the-web-is-for-everyone-interactive-functionality)
    - Klik op Code (groene knop) -> Open with GitHub Desktop
    - Klik op Clone
    - Selecteer "For my own purposes"

2. **Open het project in je codeeditor**

3. **Installeer de afhankelijkheden**
   - Gebruik npm om de benodigde pakketten te installeren door het volgende commando in de terminal uit te voeren:
   ```bash
   npm install
   ```

4. **Start de ontwikkelserver**
   - Start de server met het volgende commando:
   ```bash
   npm start
   ```

5. **Open de applicatie in je browser**
   - De server draait nu op `http://localhost:2000`. Open deze URL in je webbrowser om de applicatie te bekijken.

Volg deze stappen om de ontwikkelomgeving in te richten en aan de repository te kunnen werken. Als je vragen hebt of tegen problemen aanloopt, neem contact op met de projectbeheerder (Dylan).



