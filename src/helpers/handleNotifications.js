import axios from 'axios'

var notifications = {
    sendLocalNotifications(userId, messageTitle, messageContent){    
        axios({
            method:'post',
            url:'https://onesignal.com/api/v1/notifications',
            headers: {
            'Authorization': 'Basic YzNlN2I3YmEtMDkyMS00YjQ1LWE2NmItZTc2YjRkNWRhZmQy',
            'Content-Type':'application/json'
            },
            data:{
            "app_id":"e07379d0-8c63-41cb-b102-0c3086332aec",
            "contents":{"en":`${messageContent}`},
            "headings":{"en":`${messageTitle}`},
            "include_player_ids":[`${userId}`]
        }

        }).then(resp=>{
        }).catch(err=>{
            //console.log(err)
        })
    }
}

export default notifications;
