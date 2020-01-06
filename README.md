# commuter

**Show commuting time in the  Mac menu bar.**

Idle (outside commute hours):
![Traffic icon when outside commute hours, with no time estimate](https://uc429c69ab2ea9b84abad4f562af.previews.dropboxusercontent.com/p/thumb/AAoPVcIMWydNdP5YwkpgHtIx4y7xpv8XkS2AJtWxcuFz8wKtoX1JDH7HRkwZN-QUK6ig1wQkz6topyFogkF_QVt8Fw7E8Cf44g-KTdjf03bqb2oEl6arPIL5y2RyUlyBLsna9UDfdfklOGUMThZ-dlVz3ZGqTcdGx0WIJBB4XaPrOs5_3MUEJck7AwuATbY36VgCfDwEuZRj5expd-Xa6AyIE7mgUsFGr4Y4fRn6G_6e7dz0W-FQeBuARInL-aQsROF57oovQyex9S3h07PB3_y0qml-l9MPEMANjMLfTbYOTTuvuixBA1rFGCBW9F4iaVYT5G2tAttCB4HzjZq6cCeAmQqhzcCUisEd7F0wcJYQ4jRcvMbKsbDWajwsox8TGe3RaWzPt1pdq27r9-gDLcxE2gH7Rw0l7aPpa8CKHRW3-0DTTU4twFcHy-XyG4-so7yrgOfpTb2qFmSSpdEEdo6ES-3XiDrQOKhbzU-ESsh4OQ/p.png?fv_content=true&size_mode=5)

Shows travel time to home:
![Showing travel time to home with home icon](https://uc4e388dcf7a706458e17c8b7276.previews.dropboxusercontent.com/p/thumb/AArYEZCNXRAjyiDd8D0v2BiZV6PwKKs2jqvo4jDJyDa_7kaVh996Dxb6d-KCgpjQ6iEodBXuGEU1orxrMVssP_ysCyMFsTCS__XRvNBgjmpumM7PboyEWdoLLAGtg6wLVufbBLjbRATIIZpwt__kY3D2zOzdM9mlw0fodnCtOUK3xsQigenMN3JCeDhvxOwQuJkXrmiOKsXftKM5ta8xt3Ap4tbiFwkOyv2NtcUyWA9acfBZIHO84pqGHULCIf_bbjc8rdVY1ZRtvg25KWbEe2BKwbGhzfSsftYjOcyks1qNg14qo95YGR50KsKBaAu_KdhxS8pclwXIEYrJFpgqwXv85pGSVNSR3Ciwm-YlTzrLxeSzcYD1Js35ug_IaH5ME9pfTj4SSYoKHMcWBIZVS0Pm8cH8TbkDUHDuMrs-IL9TUtn4fjju9UiSSn39Aou-8zgjMXCes3vKFF39_B6WV2MzvVyrL5wLQFFngUyI5W8Y0Q/p.png?fv_content=true&size_mode=5)

## To Use

```bash
git clone https://github.com/lokeshrj/commuter
cd commuter
npm install
# update config.json. See #Configuration below
npm start
```

## Configuration

Update `config.json` with the following values:

- `workAddress` - Address of workplace comma separated e.g. "1000 Page Mill Rd, Palo Alto CA"
- `homeAddress` - Address of home comma separated e.g. "100 University Avenue, Palo Alto CA"
- `pollIntervalMinutes` - frequency of polling the API in minutes e.g. "5" means update every 5 minutes.
- `morningCommuteStartTime` - Time to start checking for commute time to work in the mornings. Hours only in 24 hour notation i.e. "00"-"23" e.g. "07"
- `morningCommuteEndTime` - Time to stop checking for commute time to work in the mornings.
- `eveningCommuteStartTime` - Time to start checking for commute time to home in the evenings.
- `eveningCommuteEndTime` - Time to stop checking for commute time to home in the evenings.
- `commuteDays` - Array of zero-indexed days of week that one commutes on. Week starts on Sunday at index 0. e.g. ["1", "2", "3", "4", "5"] implies a Monday-Friday commute.
- `googleMapsAPIKey` - API key for querying Google Maps Directions API

### Example `config.json`

```
{
  "workAddress": "1000 Page Mill Road, Palo Alto CA",
  "homeAddress": "100 University Avenue, Palo Alto CA",
  "pollIntervalMinutes": "5",
  "morningCommuteStartTime": "07",
  "morningCommuteEndTime": "10",
  "eveningCommuteStartTime": "15",
  "eveningCommuteEndTime": "19",
  "commuteDays": [
    "1", "2", "4", "5"
  ],
  "googleMapsAPIKey": "MyApiKey"
}
```

Above example implies a commute of Monday, Tuesday, Thursday and Friday. The morning commute window is 7AM - 10AM, and evening commute is from 3PM - 7PM. UI updates every 5 minutes.

## A note on API usage

We query the Google Maps Directions Advanced API which is a paid API. [Signup for an API key](https://developers.google.com/maps/documentation/javascript/get-api-key) and enable Directions API.
At the time of this writing, the billing rate is $1 per 100 requests, with $200 free credits per month.
The values you choose in `config.json` determine how often the API is queried, and so affects the billing rate.

As an example calculation, the example above would cause us to query the API every 5 minutes for 3 hours in the morning and 4 hours in the evening, 4 days a week. 
Assuming 4.5 weeks a month, # of API requests = (3 hours * 12 requests/hour) + (4 hours * 12 requests/hour) * 4 days per week * 4.5 weeks per month = 1512 API requests/month. 
This is $15.12 billed per month, which is currently discounted to $0 since it is under the free allowance. It is your responsibility to stay under the limit, and pay Google for any overages.

## What needs done

- Ability to set configuration in the app
- App distribution
- CI
