"use client"
import axios from "axios"
import { useEffect } from "react"

export default function TestPart() {
    useEffect(() => {
        axios.get('https://api.catopay.com/api/v1/payment/methods')
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })

        axios.get('https://ipgw-api.trelyt.com/api/v1/invoice/list')
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])
    return (
        <></>
    )
}