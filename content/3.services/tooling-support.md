---
title: Tooling Support
---
# Tooling Support

We use, know well, support and extend a number of data transformation tools, in particular some related to Knowledge Graphs. We provide consulting service for:

* **data transformation**: us using these tools on your data
* **tool training**: helping you to use these tools 
* **tool extension**: further developing existing tools to do new things
* **security maintenance**: ensuring open source tools are secure and up-to-date

![RDFlib logo](/img/logo-rdflib.png){width="100" height="100" style="float:right"}

![Jena logo](/img/logo-jena.png){width="100" height="100" style="float:right"}

## Data Manipulation

The main data manipulation tools we work with are:

1. [RDFLib](https://github.com/RDFLib/rdflib), the open source Python RDF manipulation toolkit
2. [Apache Jena](https://jena.apache.org/), a Java framework for building Semantic Web and Linked Data applications

We ue these tools to "uplift" legacy data into Knowledge Graph form and to create new data.

KurrawongAI staff currently lead the maintenance of RDFLib and are active participants in the Jena community too.

![Jena logo](/img/logo-jena-text.png){style="float:right; width:250px;"}

## Data Storage

We use many database systems for our work and anything we work on we can support you in using too. The main databases we know and use are:

![GraphDB logo](/img/logo-graphdb.png){style="float:right; width:250px;"}

3. [Fuseki](https://jena.apache.org/documentation/fuseki2/) - a leading open-source Knowledge Graph DB
4. [GraphDB](https://graphdb.ontotext.com/) - a cutting-edge commercial KG DB

## Data Delivery

![Olis logo.](/img/logo-olis.png){style="float:right; width:100px;"}
![Prez logo](/img/logo-prez.png){style="float:right; width:100px;"}

We make data available via a number of standard and custom APIs, in particular:

5. [Prez](/products/prez) - a versatile Linked Data API
6. [Olis](/products/olis) - our Knowledge Graph access control API

## Cloud Architectures

Most of our own and client systems are Cloud Computing platforms and we work with almost all the major vendors: Microsoft Azure, AWS, OpenStack...

We use and develop cor clients multi-part cloud architectures using infracode systems such as:

7. [Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?tabs=bicep)
8. [Terraform](https://developer.hashicorp.com/terraform/intro)
9. [Docker Compose](https://docs.docker.com/compose/)
10. [Podman](https://podman.io/)

We can deploy any work we do using any of these or similar tools that meet with your required architectural patterns.

::KCaseStudy
For the Australian national [Biodiversity Data Repository (BDR)](https://bdr.gov.au/), KurrawongAI initially provided a number of possible Solution Architecture to the [Department of Climate Change, Energy, the Environment & Water (DCCEEW)](https://www.dcceew.gov.au/). 

From there, three particular Knowledge Graph DB systems were selected for testing by loading in the BDR's large data holdings and monitoring query performance.

One product was chosen for initial use and deployed within an architecture to a particular public cloud. After a change in policy at DCCEEW, the architecture was moved to a different public cloud and partially rebuilt: same DB product, same APIs but different networking components and infracode scripting.

This entire system that now meets DCCEEW architectural patterns and security requirements will be handed over to DCCEEW for long-term operations by KurrawongAI in 2025.

#title
Case Study: BDR Architecture

#description
A multi KG DB selection process and cloud computing platform change.

#img
![BDR logo](/img/logo-bdr-big.png)
::

## _See our dedicated [Tools Website](https://tools.dev.kurrawong.ai/)._
