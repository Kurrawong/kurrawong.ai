---
title: System Design
---
# System Design & Implementation

## Service Offering

We implement all aspects of Knowledge Graph systems, from RDF generation scripts to databases, adaptors for external systems to work with RDF data and APIs to deliver Knowledge Graph data online as [Linked Data](https://www.w3.org/standards/semanticweb/data).

The main tasks we generally undertake for Knowledge Graph systems include:

- **establishment**
  - specification of infrastructure
  - configuration, such as index creation
  - containerisation and/or cloud infra coding
- **getting data in**
  - converting non-Knowledge Graph data into [RDF](https://www.w3.org/RDF/)
  - data loading API configuration
- **getting data out**
  - making custom APIs with tools like [Prez](/products/prez)
  - see about our Knowledge Graph [Tools](/services/tools) for what we can do to link your external systems with Knowledge Graph systems
- **management**
  - of large and/or growing data
  - of complex data
  - see [Olis](/products/olis), for our very own graph management API

We provide commercial support for RDF databases (also known as _triplestores_), in particular [Fuseki](/products/fuseki). Find out about our approach to [products](/products) for more information.

::KCaseStudy
KurrawongAI staff extracted hydrological catchment data from an offline spatial data source using [RDFLib](https://github.com/RDFLib/rdflib) and created Knowledge Graph data (RDF) from it, based on the [Geofabric Ontology](https://linked.data.gov.au/def/geofabric) we designed for it. We then loaded the data into a Knowledge Graph database ([Fuseki](/products/fuseki)) and then delivered the information online using [Prez](/products/prez).

This Geofabric Linked Data System is part of Geoscience Australia's Knowledge Graph-based [FSDF Data Platform](https://geoscienceaustralia.github.io/fsdf-supermodel/supermodel.html) which is being built to support their _Digital Atlas of Australia_.

We continue to support the operations of the Geofabric Linked Data System and expect to enhance the data it delivers in the future due to international interest in the delivery of spatial Semantic Web data.

#title
Case Study: Geofabric Linked Data System

#description
This is an example of a large-scale, operational, Linked Data system.

#img
![Macleay River catchment geometry](/img/catchment.png)
::

---

_Please contact us to find out more about our Knowledge Graph System Design & Implementation services!_