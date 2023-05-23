
class CheckAdmin{

    check(userID){

        let body = JSON.stringify(
            {
                name: 'checkAdmin',
                param: {
                    userID: userID
                }
            }
        )

        let userAdmin = fetch('https://udicat.muniguate.com/apps/ave_api/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'CONTENT-TYPE': 'application/json'
                },
                body: body
            })
            .then((response) => response.json())
            .then((responseJson) => {

                return responseJson.response.result
                
            })
            .catch((error) => {

            })

        return userAdmin
    }

}

export default CheckAdmin



