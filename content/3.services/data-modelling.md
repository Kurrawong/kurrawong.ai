---
title: Data Modelling
---
# Data Modelling

## Service Offering

KurrawongAI is extremely experienced with the creation and implementation of many forms of data models. While increasingly we focus on Knowledge Graphs / Semantic Web data modelling, we have decades of collective experience in relational systems, UML and other forms of data modelling too.

Our preferred modelling systems are:

* [Wen Ontology Language (OWL)](https://www.w3.org/TR/owl2-primer/)
* [Shapes Constraint Language (SHACL)](https://www.w3.org/TR/shacl/)
* Relational Database modelling

::KCaseStudy
KurrawongAI implemented a new Addressing data model for the Queensland government that catered for future address data requirements, as specified in the [ICSM Addressing 2035 strategy](https://www.icsm.gov.au/publications/addressing-2035). This model is now accepted as an [ICSM](https://www.icsm.gov.au/) Australian & NZ standard for use in all jurisdictions.

This built on previous OWL model of address information derived from the [Geocoded National Address file relational model](https://data.gov.au/dataset/ds-dga-19432f89-dc3a-4ef3-b943-5326ef1dbecc) and an OWL version of the [ISO 19160 international address model](https://linked.data.gov.au/def/iso19160-1-address) that KurrawongAI staff developed during 2017 - 2019 while working in previous employment.

We implemented example data for this model within a Knowledge Graph system ([Fuseki](/products/fuseki)) and also a relational database system (Postgres) to demonstrate the model's platform independence.

Queensland has now operationalised a new state address database using the Knowledge Graph implementation of this model.

#title
Case Study: Address Model for ANZ

#description
This is an example of an OWL modelling and multi-system implementation project. <https://linked.data.gov.au/def/addr>

#img
![Address model diagram](/img/addr-model.png)
::


We offer the following data modelling services:

- **domain-specific data modelling**
  - we've modelled in many domains, such as <span style="color:darkgrey;">archiving</span>, <span style="color:green;">environmental science</span>, <span style="color:darkblue;">spatial data</span> and <span style="color:darkred;">mining</span>
  - we are able to pair up with your domain experts and develop models with them
- **enterprise data modelling**
  - so-called "Supermodel" modelling whereby we model a broad scenario's requirements as a data model and include individual systems/datasets models within it
  - Supermodels are compartmentalised allowing for staged implementation
- **model skill demonstration**
  - query-based competency testing of models
  - demonstrate the power of Knowledge Graph models
- **example data generation**
  - we can hand-make data to assist with model demonstration for specific scenarios
- **data model review**
  - reviewing your data models to ensure quality
  - to align with other models
- **model-based data transform**
  - transforming data from one system to another, based on models
  - see more about our Knowledge Graph [Tools](/services/tools) service offering


::KCaseStudy
KurrawongAI is implementing a "Supermodel", that is a integrated set of models, for the [Geological Survey of Western Australia (GSWA)](http://www.dmp.wa.gov.au/geological-survey/geological-survey-262.aspx). This allows originally internal siloed data to be combined and delivered publicly. It also makes it interoperable with national & international geological data.

The [GSWA Supermodel](https://kurrawong.github.io/gswa-supermodel/) implements an overarching "backbone" model that integrates "component models" for each internal silo through the use of standardised "background models". These models use [GSWA controlled vocabularies](https://vocabulary.gswa.kurrawong.ai/) and many external vocabularies, such as the [international chronostratigraphic chart](https://stratigraphy.org/chart-data/) to ensure common values across datasets. 

#title
Case Study: GSWA Supermodel

#description
This enterprise & domain data modelling in the mining sector.

#img
![Address model diagram](/img/gswa-supermodel-overview.png)
::

---

_Please contact us to find out more about our Data Modelling services!_