![Screeps](https://screeps.com/a/components/top/logo.png)

##  Screeps Game Implementation For Powerful Colony.


## Main Purpose:
* Upgrade our Room Controller.
* Build structures.
  
  
### 2 Main Roles.
  
  * Upgrader creeps should work on upgrading the Room Controller.
  
  * Harvester/Builder creep should work on building and energizing structures.<br>
  if harvesters doesn't found structures needs energy then convert them to builders to build structures.<br>
  if builder doesn't found construction sites to build then convert them to harvesters to energize structures.
        <br>     ***note***  we don't convert all creeps at once instead we convert one by one so we can have a building and energizing case

# Tips
## More Extensions MORE Powerful Creeps
  we should dynamically add parts to creeps based on the energyAvailable.     
  
## Bigger Colony Bigger Resources
  we should every time we had full energyCapacityAvailable build an extension to push the current capacity limit for more energy reservation.
   
## Dying Creeps 
  we should regenerate (powerful if we can)  creeps and maintain the 2 roles of creeps equally as many as extension we have.
  
