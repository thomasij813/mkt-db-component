import Airtable from 'airtable'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import {sum} from 'd3-array'

import secret from '../secret/secret.js'

import drawChart from './chart'

import '../style/style.css'

const base = new Airtable({apiKey: secret.AIRTABLE_API_KEY}).base('appRy8SRmZss11P7C');

base('Emails').select({
    view: 'Marketing DB',
    timeZone: 'America/Los_Angeles'
})

const asyncFunction = async () => {
    let emailData = []

    await base('Emails').select({
        view: 'Marketing DB'
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(record => {
            const d = {
                subject: record.fields.Subject,
                date: new Date(record.fields.Date),
                sends: record.fields.Sends,
                views: record.fields.Views,
                clickBacks: record.fields['Click Backs'],
                weekGroup: +record.fields.WeekGroup,
                callToAction: record.fields['Call to Action']
            }
            emailData.push(d)
        })
        fetchNextPage()
    })

    const emailDataGrouped = nest()
        .key(d => d.weekGroup)
        .rollup(v => {
            return {
                activities: v.length,
                sends: sum(v, d => d.sends),
                views: sum(v, d => d.views),
                clickBacks: sum(v, d => d.clickBacks),
                records: v
            }
        })
        .entries(emailData)
        .map(d => {
            d.week = startOfWeek(d.value.records[0].date)
            return d
        })
        .filter(d => d.value.sends > 0)

    function startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    
        return new Date(date.setDate(diff));
    }
    
    drawChart(emailDataGrouped, select('svg'))
}

asyncFunction()