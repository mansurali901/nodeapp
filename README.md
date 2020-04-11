# airfinder admin
## Overview
App mainly for linklabs or partners to setup customers.
Can setup the site
Can manage the orgs
Can search where a device is

### Code structure

    ├── public            //static files thate are copied over or updated (index.html)
    ├── src
    │   ├── assets        //image files and such
    │   ├── components    //component code, a component is an item, like a dropdown, grid, map, etc..
    │   ├── scss          //scss for variables and global styling
    │   ├── services      //these are apis
    │   ├── store         //this should be stores as it's many, the main global one and the context specific others
    │   └── views         //views are a collection of components, they are what pages are
    │   ├── constants.js  //common constants used in the app
    │   ├── main.js       //point of app entry
    │   ├── router.js     //the routes for the app
    │   ├── utils.js      //misc functions, like tokenInfo, sortByName,etc...
    │   ├── App.vue       //main container for the app


### Stores
A store is where the
state
messages
methods
all exists for the view/components to interact
index.js -> main global store
setup.js -> setup site section store
devices.js -> device search section
orgs.js -> orgs section


### Setup Site
The views for this are 
Setup.vue  -> sites  
SetupArea.vue -> CRUD areas for a site, this where adding an area with map happens  
SetupZones.vue -> CRUD locations, access points, gateways and zones.  Interaction with the maps (indoor/outdoor) happens here  

#### Uses
Mapbox-gl for map, shares the same license that is used in the airfinder ui
Calls the google api to do geolocation on an address


### Orgs
The views for this are
Orgs.vue -> add/search/select an org, uses the same layout as Setup.vue (site)
Org.vue  -> org details view


### Search Devices
Search for devices to see where they are provisioned to
Devices.vue -> the page this happens



## Deployment
Currently no pipeline, needs to be built 

### S3 buckets
admin-dev.airfinder.com --> Dev environment  
admin-devops.airfinder.com --> Deveops environment  
admin-hotel.airfinder.com --> Hotel (Hospitality) environment  
admin-test-harness.airfinder.com --> Test Harness environment  
admin.airfinder.com --> Legacy production environment  
admin-supertagdev.airfinder.com --> Supertag Dev environment
admin-beta.airfinder.com --> Supertag Production environment

### Cmd to deploy
Manual deployment for example to dev environment
Build
```
cd <arifindder-admin>
docker-compose run app --entrypoint run build:dev
```
NOTE: to build for other envs look in package.json and use that run build:<env>

To deploy, aws client or aws shell (https://github.com/awslabs/aws-shell)
NOTE: needs to be configured
There is a deployment IAM user created for this (s3-release-app), API access only
Once aws is configured, in same directory

```
aws-shell
s3 sync ./dist/ s3://admin-dev.airfinder.com/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --cache-control 'no-cache, no-store
```
NOTE: again to deploy to a different environment just pick a different s3 bucket