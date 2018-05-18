ruleset discover {
  meta {
    shares __testing
    use module io.picolabs.subscription alias subscription
  }
  global {
    __testing = { "queries": [ { "name": "__testing" } ],
                  "events": [ { "domain": "discover", "type": "addResource",
                      "attrs": [ "name" ] },
                      { "domain": "discover", "type": "addObserver",
                      "attrs": [] } ] }
  
  initiate_subscription = defaction(eci, wellKnown, optionalHost = meta:host){
      every{
        event:send({
          "eci": eci, "eid": "subscription",
          "domain": "wrangler", "type": "subscription",
          "attrs": {
                   "wellKnown_Tx": wellKnown, 
                   "Tx_host"     : meta:host,
                   "engine_Id"   : event:attr("advertisement"){"id"} } 
        }, host = optionalHost)
      }
    }
    
  }
  
  rule engine_found{
    select when discovery engine_found where advertisement >< "Temperature" 
      initiate_subscription(event:attr("advertisement"){"Temperature"}, subscription:wellKnown_Rx(){"id"});
  }

  rule new_resource {
    select when wrangler subscription_added
    if event:attr("engine_Id") then noop();
    fired {
      ent:engine_id_2_subs_ids := ent:engine_id_2_subs_ids 
                .put(event:attr("engine_Id"),
                    ent:engine_id_2_subs_ids{event:attr("engine_Id")}.defaultsTo([])
                    .append(event:attr("Id"))
                )
    }
  }
  
  rule engine_lost{
    select when discovery engine_lost
    foreach ent:engine_Id_2_subs_Ids{event:attr("engine_Id")} setting(id)
    always{
      raise wrangler event "established_removal" attributes event:attrs.put("Id",id)
    }
  }

  rule addResource {
    select when discover addResource
      D:addResource("discover",subscription:wellKnown_Rx(){"id"});
  }

  rule addObserver {
    select when discover addObserver
      D:addDid(meta:eci);
  }
  
  //Accept the incoming subscription requests from other sensors.
  rule auto_accept {
    select when wrangler inbound_pending_subscription_added
    fired {
      raise wrangler event "pending_subscription_approval"
        attributes event:attrs
    }
  }
  
}
