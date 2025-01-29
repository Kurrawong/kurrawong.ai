---
title: Tools
---
# Knowledge Graph Tooling

We have several staff who are long-time developers of the open source [RDFLib](https://github.com/RDFLib/rdflib) Python RDF manipulation toolkit, including Nicholas and Edmond who are RDFLib maintainers. We use it to convert non-KG data into RDF for loading into graph databases. We also know well and use the [Jena framework's tools](https://jena.apache.org/documentation/tools/) for this.

Both RDFLib and Jena tools can be used as libraries within scripts and workflows to generate RDF data from non-RDF sources, such as relational databases, spatial data files and so on. We have many instances of custom data pipelines that we've developed to create and update RDF data using these tools.

In addition to our contribution to open source tooling, we maintain a simple user interface for online access and use of a number of RDF conversion and validation tools based on RDFLib, imaginatively titled [RDFTools](https://tools.dev.kurrawong.ai/). This provides assistance with a number of validation, conversion and parsing tasks that are commonly helpful when working with RDF. These include:

- **[RDF Converter](https://tools.dev.kurrawong.ai/convert)** - convert between different RDF formats
- **[RDF Validator](https://tools.dev.kurrawong.ai/validate)** - Validate RDF data against SHACL rules
- **[VocExcel](https://tools.dev.kurrawong.ai/vocexcel)** - convert Excel data to SKOS vocabularies

For other open-source tools we contribute to, see their GitHub repositories for installation and use:
- **[kurra](https://github.com/Kurrawong/kurrawong-python)** - a command line tool for interactions with Fuseki databases
- **[RDFrame](https://github.com/Kurrawong/rdframe-lib)**
- **[labilify](https://github.com/Kurrawong/labelify)**
- **[pyLODE](https://github.com/RDFLib/pyLODE)** - used to generate human-readable HTML documentation from ontologies
- **[SPARQL parser](https://github.com/Kurrawong/sparql)**

---

![RDFlib logo](/img/logo-rdflib.png){width="200" height="200" style="float: right"}

## Service Offering

We offer the following Knowledge Graph tooling services:

- **creation and application of RDFLib and Jena-based tooling**
  - if you need a custom script or program to create or manipulate Knowledge Graph data, we can likely build a suitable solution using RDFLib or Jena
- **custom product creation**
  - if we find that a custom script or program is highly reusable, we can package that up for you as a custom product
  
_(This is what has happened with RDFtools; we made this and a customer realised they would benefit from their own in-house copy of it, tailored to their needs.)_<br/>

- **supported use of pySHACL, pyLODE RDFTools & VocExcel**
  - we've developed these tools and are happy to assist you with their use


---

_Knowledge Graph tooling deployments are usually one-off things. Please contact us for a quote for your needs!_