
// file to construct a JSON object that maps penal code acts to police crime heads

/*

the following crime heads are not represented in the present data sample

 गुण्डा अधिनियम	उत्तर प्रदेश गुंडागर्दी नियंत्रण अधिनियम, 197
 आवश्यक वस्तु अधिनियम	आवश्यक वस्तु अधिनियम, 1955
 राष्ट्रीय सुरक्षा अधिनियम	राष्ट्रीय सुरक्षा अधिनियम, 1980
 
*/

var crimeHeads = [
	{
		key: "Rioting",
		patterns: [/1860-146/, /1860-147/, /1860-148/]
	},
	{
		key: "Housebreaking",
		patterns: [/1860-445/, /1860-446/, /1860-453/, /1860-454/, /1860-455/, /1860-456/, /1860-457/, /1860-459/, /1860-460/] 
	},
	{
		key: "Dacoity",
		patterns: [/1860-395/, /1860-396/, /1860-397/, /1860-398/] 
	},
	{
		key: "Loot",
		patterns: [/1860-392/, /1860-393/, /1860-394/] 
	},
	{
		key: "Murder",
		patterns: [/1860-302/] 
	},
	{
		key: "Dowry Murder",
		patterns: [/1860-304-B/] 
	},
	{
		key: "Rape",
		patterns: [/1860-376/] 
	},
	{
		key: "Kidnapping for ransom",
		patterns: [/1860-364/] 
	},
	{
		key: "Robbery",
		patterns: [/1860-378/, /1860-379/, /1860-380/, /1860-381/, /1860-382/, /1860-397/, /1860-392/, /1860-393/, /1860-394/] 
	},
	{
		key: "Molestation",
		patterns: [/1860-354/] 
	},
	{
		key: "Gambling",
		patterns: [/GAMBLING/i] 
	},
	{
		key: "Corruption",
		patterns: [/CORRUPTION/i] 
	},
	{
		key: "Narcotics",
		patterns: [/NARCOTIC/i] 
	},
	{
		key: "Tax evasion",
		patterns: [/EXCISE/i] 
	},
	{
		key: "Illegal arms",
		patterns: [/ARMS/i] 
	},
	{
		key: "Unlawful Activities",
		patterns: [/Unlawful Activities/i] 
	},
	{
		key: "Cow slaughter",
		patterns: [/COW/i] 
	},
	{
		key: "SC/ST atrocities",
		patterns: [/Atrocities/i] 
	},{
		key: "Cybercrime",
		patterns: [/TECHNOLOGY/i] 
	},{
		key: "POCSO",
		patterns: [/CHILDREN/i] 
	},
	{
		key: "Encounters",
		patterns: [/1860-307/] 
	},
	{
		key: "Anti-social activity",
		patterns: [/ANTI-SOCIAL/i] 
	}
];

module.exports = crimeHeads;