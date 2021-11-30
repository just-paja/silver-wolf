# User roles

This document describes user roles used in the system. Each role represents a purposeful persona that has dealings in the system. This list is expected to expand over time, as we find new roles.

## Administrator

The purpose of having administrator is to have maximum access to all resources.

## Signup mage (Přihláškový mág)

This person verifies validity of data from parents and children that sign up to the summer camp.

## Family (Rodina)

A family represents a group of people and grants permissions to resources based on [Family role](./#family-roles). A user can be in many families.

### Family Administrator (Správce)

Technically represents a legal representative with admin powers. Has access to all family resources, can create signups, can send signups, can grant other users access to the family. Cannot remove this status from himself, unless he appoints a new Family Administrator. Can delete a family.

### Representative (Zákonný zástupce)

Represents a legal representative that is allowed to send signups.

### Spectator (Divák)

Has read access to all camp level media related to the family. Can put likes on photos. Can see a list of family members.

### Little Spectator (Malý divák)

Represents a kid that goes to a summer camp. Can only see camp level media related to the camp he is signed up for.

## Website visitor (Návštěvník webu)

Unspecified anonymous visitor of the website. This role should break down into specific website visitor personas, however, we are lazy at the moment and do not want to overthink this.

