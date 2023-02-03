export async function sendManageRequest(path = '', object = {}){
    const res = await fetch(`/api/manage${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })

    const {data, status} = await res.json()

    return {data, status}
}