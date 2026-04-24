import { M as e } from "./store-CjzZDQt8.js";
import { BehaviorSubject as t, distinctUntilChanged as n, map as r, shareReplay as i } from "rxjs";
var a = e({
	theme: null,
	volume: .15,
	muted: !1
}, "local", "schmancy-sound-settings"), o = {
	joyful: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 3e3,
			volume: .3
		}, {
			startTime: .06,
			duration: .1,
			frequency: 3500,
			volume: .35
		}],
		tones: [
			{
				startTime: .02,
				duration: .15,
				frequency: 784,
				volume: .25,
				type: "sine"
			},
			{
				startTime: .1,
				duration: .2,
				frequency: 988,
				volume: .3,
				type: "sine"
			},
			{
				startTime: .18,
				duration: .25,
				frequency: 1175,
				volume: .25,
				type: "sine"
			}
		]
	},
	content: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1500,
			volume: .25
		}],
		tones: [{
			startTime: .05,
			duration: .3,
			frequency: 523,
			volume: .2,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .35,
			frequency: 659,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}]
	},
	excited: {
		puffs: [
			{
				startTime: 0,
				duration: .06,
				frequency: 2500,
				volume: .25
			},
			{
				startTime: .05,
				duration: .06,
				frequency: 3e3,
				volume: .3
			},
			{
				startTime: .1,
				duration: .08,
				frequency: 3500,
				volume: .35
			}
		],
		tones: [
			{
				startTime: .02,
				duration: .12,
				frequency: 880,
				volume: .2,
				type: "sine"
			},
			{
				startTime: .08,
				duration: .12,
				frequency: 1047,
				volume: .25,
				type: "sine"
			},
			{
				startTime: .14,
				duration: .15,
				frequency: 1319,
				volume: .3,
				type: "sine"
			}
		]
	},
	proud: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1800,
			volume: .3
		}],
		tones: [
			{
				startTime: .05,
				duration: .25,
				frequency: 523,
				volume: .25,
				type: "sine"
			},
			{
				startTime: .08,
				duration: .25,
				frequency: 659,
				volume: .2,
				type: "sine"
			},
			{
				startTime: .11,
				duration: .3,
				frequency: 784,
				volume: .25,
				type: "sine"
			}
		]
	},
	hopeful: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 2200,
			volume: .2
		}],
		tones: [{
			startTime: .03,
			duration: .3,
			frequency: 659,
			volume: .2,
			type: "sine",
			frequencyEnd: 880
		}]
	},
	relieved: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 1200,
			volume: .35
		}],
		tones: [{
			startTime: .1,
			duration: .35,
			frequency: 659,
			volume: .2,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .25,
			duration: .4,
			frequency: 523,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}]
	},
	grateful: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1500,
			volume: .25
		}],
		tones: [
			{
				startTime: .05,
				duration: .3,
				frequency: 440,
				volume: .2,
				type: "sine",
				filterFrequency: 800
			},
			{
				startTime: .15,
				duration: .35,
				frequency: 523,
				volume: .2,
				type: "sine",
				filterFrequency: 800
			},
			{
				startTime: .25,
				duration: .4,
				frequency: 659,
				volume: .15,
				type: "sine",
				filterFrequency: 800
			}
		]
	},
	peaceful: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 800,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .5,
			frequency: 392,
			volume: .12,
			type: "sine",
			filterFrequency: 500
		}]
	},
	playful: {
		puffs: [
			{
				startTime: 0,
				duration: .05,
				frequency: 2800,
				volume: .2
			},
			{
				startTime: .08,
				duration: .05,
				frequency: 3200,
				volume: .25
			},
			{
				startTime: .14,
				duration: .06,
				frequency: 2800,
				volume: .2
			}
		],
		tones: [
			{
				startTime: .03,
				duration: .1,
				frequency: 784,
				volume: .2,
				type: "sine"
			},
			{
				startTime: .1,
				duration: .08,
				frequency: 988,
				volume: .25,
				type: "sine"
			},
			{
				startTime: .16,
				duration: .12,
				frequency: 784,
				volume: .2,
				type: "sine"
			}
		]
	},
	amused: {
		puffs: [
			{
				startTime: 0,
				duration: .04,
				frequency: 2500,
				volume: .2
			},
			{
				startTime: .06,
				duration: .04,
				frequency: 2800,
				volume: .22
			},
			{
				startTime: .11,
				duration: .05,
				frequency: 2600,
				volume: .18
			}
		],
		tones: [{
			startTime: .05,
			duration: .15,
			frequency: 880,
			volume: .15,
			type: "sine"
		}]
	},
	curious: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 2e3,
			volume: .2
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 659,
			volume: .2,
			type: "sine",
			frequencyEnd: 880
		}]
	},
	inspired: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 2500,
			volume: .25
		}],
		tones: [
			{
				startTime: .05,
				duration: .3,
				frequency: 523,
				volume: .2,
				type: "sine"
			},
			{
				startTime: .07,
				duration: .28,
				frequency: 784.5,
				volume: .16,
				type: "sine"
			},
			{
				startTime: .09,
				duration: .26,
				frequency: 1046,
				volume: .12,
				type: "sine"
			}
		]
	},
	confident: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 1500,
			volume: .3
		}],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 523,
			volume: .25,
			type: "sine"
		}, {
			startTime: .06,
			duration: .22,
			frequency: 659,
			volume: .2,
			type: "sine"
		}]
	},
	loved: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1e3,
			volume: .2
		}],
		tones: [{
			startTime: .08,
			duration: .4,
			frequency: 392,
			volume: .18,
			type: "sine",
			filterFrequency: 600
		}, {
			startTime: .2,
			duration: .45,
			frequency: 494,
			volume: .15,
			type: "sine",
			filterFrequency: 600
		}]
	},
	comforted: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 900,
			volume: .18
		}],
		tones: [{
			startTime: .1,
			duration: .35,
			frequency: 523,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .25,
			duration: .4,
			frequency: 440,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	energized: {
		puffs: [{
			startTime: 0,
			duration: .05,
			frequency: 3e3,
			volume: .25
		}, {
			startTime: .04,
			duration: .05,
			frequency: 3500,
			volume: .28
		}],
		tones: [
			{
				startTime: .02,
				duration: .1,
				frequency: 784,
				volume: .2,
				type: "sine"
			},
			{
				startTime: .08,
				duration: .12,
				frequency: 988,
				volume: .25,
				type: "sine"
			},
			{
				startTime: .14,
				duration: .15,
				frequency: 1175,
				volume: .22,
				type: "sine"
			}
		]
	},
	celebrated: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 2500,
			volume: .2
		}],
		tones: [
			{
				startTime: .02,
				duration: .18,
				frequency: 523,
				volume: .22,
				type: "sine"
			},
			{
				startTime: .08,
				duration: .18,
				frequency: 659,
				volume: .24,
				type: "sine"
			},
			{
				startTime: .14,
				duration: .2,
				frequency: 784,
				volume: .26,
				type: "sine"
			},
			{
				startTime: .22,
				duration: .3,
				frequency: 1047,
				volume: .22,
				type: "sine"
			}
		]
	},
	sad: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .25
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 392,
			volume: .2,
			type: "sine",
			filterFrequency: 400
		}, {
			startTime: .3,
			duration: .45,
			frequency: 294,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	lonely: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 700,
			volume: .2
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 330,
			volume: .12,
			type: "sine",
			filterFrequency: 450
		}]
	},
	disappointed: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .25
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			frequencyEnd: 349
		}]
	},
	heartbroken: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .25
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 392,
			volume: .2,
			type: "sine",
			filterFrequency: 400
		}, {
			startTime: .3,
			duration: .45,
			frequency: 294,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	grieving: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .25
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 392,
			volume: .2,
			type: "sine",
			filterFrequency: 400
		}, {
			startTime: .3,
			duration: .45,
			frequency: 294,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	hopeless: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 700,
			volume: .2
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 330,
			volume: .12,
			type: "sine",
			filterFrequency: 450
		}]
	},
	empty: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 700,
			volume: .2
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 330,
			volume: .12,
			type: "sine",
			filterFrequency: 450
		}]
	},
	discouraged: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .25
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			frequencyEnd: 349
		}]
	},
	melancholic: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 700,
			volume: .18
		}],
		tones: [{
			startTime: .1,
			duration: .45,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 500
		}, {
			startTime: .3,
			duration: .5,
			frequency: 392,
			volume: .12,
			type: "sine",
			filterFrequency: 450
		}]
	},
	homesick: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 440,
			volume: .12,
			type: "sine",
			filterFrequency: 500
		}, {
			startTime: .3,
			duration: .45,
			frequency: 392,
			volume: .1,
			type: "sine",
			filterFrequency: 450
		}]
	},
	hurt: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .25
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 392,
			volume: .2,
			type: "sine",
			filterFrequency: 400
		}, {
			startTime: .3,
			duration: .45,
			frequency: 294,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	miserable: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .25
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 392,
			volume: .2,
			type: "sine",
			filterFrequency: 400
		}, {
			startTime: .3,
			duration: .45,
			frequency: 294,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	regretful: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 700,
			volume: .18
		}],
		tones: [{
			startTime: .1,
			duration: .45,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 500
		}, {
			startTime: .3,
			duration: .5,
			frequency: 392,
			volume: .12,
			type: "sine",
			filterFrequency: 450
		}]
	},
	ashamed: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .25
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			frequencyEnd: 349
		}]
	},
	inferior: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .25
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			frequencyEnd: 349
		}]
	},
	anxious: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 1800,
			volume: .2
		}, {
			startTime: .12,
			duration: .08,
			frequency: 1900,
			volume: .22
		}],
		tones: [{
			startTime: .03,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine"
		}],
		description: "Tight, quick puffs with uncertain wobble"
	},
	worried: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1200,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 349,
			volume: .15,
			type: "sine",
			frequencyEnd: 392
		}]
	},
	afraid: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 1800,
			volume: .2
		}, {
			startTime: .12,
			duration: .08,
			frequency: 1900,
			volume: .22
		}],
		tones: [{
			startTime: .03,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine"
		}]
	},
	terrified: {
		puffs: [{
			startTime: 0,
			duration: .04,
			frequency: 3500,
			volume: .3
		}],
		tones: [{
			startTime: 0,
			duration: .08,
			frequency: 1047,
			volume: .25,
			type: "sine"
		}, {
			startTime: .05,
			duration: .15,
			frequency: 880,
			volume: .15,
			type: "sine"
		}]
	},
	panicked: {
		puffs: [{
			startTime: 0,
			duration: .04,
			frequency: 3500,
			volume: .3
		}],
		tones: [{
			startTime: 0,
			duration: .08,
			frequency: 1047,
			volume: .25,
			type: "sine"
		}, {
			startTime: .05,
			duration: .15,
			frequency: 880,
			volume: .15,
			type: "sine"
		}]
	},
	nervous: {
		puffs: [
			{
				startTime: 0,
				duration: .05,
				frequency: 2e3,
				volume: .18
			},
			{
				startTime: .08,
				duration: .05,
				frequency: 2100,
				volume: .18
			},
			{
				startTime: .15,
				duration: .06,
				frequency: 2e3,
				volume: .16
			}
		],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 494,
			volume: .12,
			type: "sine"
		}]
	},
	uneasy: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1200,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 349,
			volume: .15,
			type: "sine",
			frequencyEnd: 392
		}]
	},
	insecure: {
		puffs: [
			{
				startTime: 0,
				duration: .05,
				frequency: 2e3,
				volume: .18
			},
			{
				startTime: .08,
				duration: .05,
				frequency: 2100,
				volume: .18
			},
			{
				startTime: .15,
				duration: .06,
				frequency: 2e3,
				volume: .16
			}
		],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 494,
			volume: .12,
			type: "sine"
		}]
	},
	overwhelmed: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 1800,
			volume: .2
		}, {
			startTime: .12,
			duration: .08,
			frequency: 1900,
			volume: .22
		}],
		tones: [{
			startTime: .03,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine"
		}]
	},
	stressed: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 1800,
			volume: .2
		}, {
			startTime: .12,
			duration: .08,
			frequency: 1900,
			volume: .22
		}],
		tones: [{
			startTime: .03,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine"
		}]
	},
	tense: {
		puffs: [{
			startTime: 0,
			duration: .08,
			frequency: 1800,
			volume: .2
		}, {
			startTime: .12,
			duration: .08,
			frequency: 1900,
			volume: .22
		}],
		tones: [{
			startTime: .03,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine"
		}]
	},
	apprehensive: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1200,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 349,
			volume: .15,
			type: "sine",
			frequencyEnd: 392
		}]
	},
	startled: {
		puffs: [{
			startTime: 0,
			duration: .04,
			frequency: 3500,
			volume: .3
		}],
		tones: [{
			startTime: 0,
			duration: .08,
			frequency: 1047,
			volume: .25,
			type: "sine"
		}, {
			startTime: .05,
			duration: .15,
			frequency: 880,
			volume: .15,
			type: "sine"
		}]
	},
	suspicious: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1200,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 349,
			volume: .15,
			type: "sine",
			frequencyEnd: 392
		}]
	},
	vulnerable: {
		puffs: [
			{
				startTime: 0,
				duration: .05,
				frequency: 2e3,
				volume: .18
			},
			{
				startTime: .08,
				duration: .05,
				frequency: 2100,
				volume: .18
			},
			{
				startTime: .15,
				duration: .06,
				frequency: 2e3,
				volume: .16
			}
		],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 494,
			volume: .12,
			type: "sine"
		}]
	},
	annoyed: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	irritated: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	frustrated: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	angry: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	enraged: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	bitter: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	resentful: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	jealous: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	envious: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	indignant: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	impatient: {
		puffs: [
			{
				startTime: 0,
				duration: .04,
				frequency: 1500,
				volume: .2
			},
			{
				startTime: .08,
				duration: .04,
				frequency: 1500,
				volume: .2
			},
			{
				startTime: .16,
				duration: .04,
				frequency: 1500,
				volume: .22
			}
		],
		tones: [{
			startTime: .06,
			duration: .1,
			frequency: 523,
			volume: .15,
			type: "sine"
		}]
	},
	hostile: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 900,
			volume: .28
		}],
		tones: [{
			startTime: .04,
			duration: .15,
			frequency: 349,
			volume: .2,
			type: "sine"
		}, {
			startTime: .12,
			duration: .12,
			frequency: 330,
			volume: .18,
			type: "sine"
		}]
	},
	contemptuous: {
		puffs: [{
			startTime: 0,
			duration: .1,
			frequency: 1e3,
			volume: .25
		}],
		tones: [{
			startTime: .03,
			duration: .2,
			frequency: 294,
			volume: .18,
			type: "sine",
			filterFrequency: 400
		}]
	},
	tired: {
		puffs: [{
			startTime: 0,
			duration: .35,
			frequency: 500,
			volume: .2
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 330,
			volume: .12,
			type: "sine",
			filterFrequency: 350
		}]
	},
	exhausted: {
		puffs: [{
			startTime: 0,
			duration: .45,
			frequency: 400,
			volume: .18
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 294,
			volume: .1,
			type: "sine",
			filterFrequency: 300
		}]
	},
	drained: {
		puffs: [{
			startTime: 0,
			duration: .45,
			frequency: 400,
			volume: .18
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 294,
			volume: .1,
			type: "sine",
			filterFrequency: 300
		}]
	},
	burnedOut: {
		puffs: [{
			startTime: 0,
			duration: .45,
			frequency: 400,
			volume: .18
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 294,
			volume: .1,
			type: "sine",
			filterFrequency: 300
		}]
	},
	numb: {
		puffs: [{
			startTime: 0,
			duration: .45,
			frequency: 400,
			volume: .18
		}],
		tones: [{
			startTime: .15,
			duration: .5,
			frequency: 294,
			volume: .1,
			type: "sine",
			filterFrequency: 300
		}]
	},
	bored: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 600,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .3,
			frequency: 349,
			volume: .1,
			type: "sine",
			filterFrequency: 400
		}]
	},
	unmotivated: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 600,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .3,
			frequency: 349,
			volume: .1,
			type: "sine",
			filterFrequency: 400
		}]
	},
	apathetic: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 600,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .3,
			frequency: 349,
			volume: .1,
			type: "sine",
			filterFrequency: 400
		}]
	},
	restless: {
		puffs: [{
			startTime: 0,
			duration: .35,
			frequency: 500,
			volume: .2
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 330,
			volume: .12,
			type: "sine",
			filterFrequency: 350
		}]
	},
	calm: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .12
		}],
		tones: [{
			startTime: .1,
			duration: .5,
			frequency: 392,
			volume: .1,
			type: "sine",
			filterFrequency: 500
		}]
	},
	relaxed: {
		puffs: [{
			startTime: 0,
			duration: .35,
			frequency: 700,
			volume: .15
		}],
		tones: [{
			startTime: .15,
			duration: .45,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .35,
			duration: .5,
			frequency: 392,
			volume: .08,
			type: "sine",
			filterFrequency: 800
		}]
	},
	atEase: {
		puffs: [{
			startTime: 0,
			duration: .35,
			frequency: 700,
			volume: .15
		}],
		tones: [{
			startTime: .15,
			duration: .45,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .35,
			duration: .5,
			frequency: 392,
			volume: .08,
			type: "sine",
			filterFrequency: 800
		}]
	},
	balanced: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .12
		}],
		tones: [{
			startTime: .1,
			duration: .5,
			frequency: 392,
			volume: .1,
			type: "sine",
			filterFrequency: 500
		}]
	},
	stable: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 500,
			volume: .2
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 262,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	secure: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 700,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 349,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .25,
			duration: .45,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}]
	},
	safe: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 700,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 349,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .25,
			duration: .45,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}]
	},
	centered: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 500,
			volume: .2
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 262,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	grounded: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 500,
			volume: .2
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 262,
			volume: .15,
			type: "sine",
			filterFrequency: 350
		}]
	},
	accepting: {
		puffs: [{
			startTime: 0,
			duration: .3,
			frequency: 600,
			volume: .12
		}],
		tones: [{
			startTime: .1,
			duration: .5,
			frequency: 392,
			volume: .1,
			type: "sine",
			filterFrequency: 500
		}]
	},
	connected: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .12,
			duration: .32,
			frequency: 523,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	accepted: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1500,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			filterFrequency: 800
		}]
	},
	included: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .12,
			duration: .32,
			frequency: 523,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	belonging: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .12,
			duration: .32,
			frequency: 523,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	appreciated: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1500,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			filterFrequency: 800
		}]
	},
	valued: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1500,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			filterFrequency: 800
		}]
	},
	respected: {
		puffs: [{
			startTime: 0,
			duration: .15,
			frequency: 1500,
			volume: .2
		}],
		tones: [{
			startTime: .05,
			duration: .25,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			filterFrequency: 800
		}]
	},
	supported: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 900,
			volume: .18
		}],
		tones: [{
			startTime: .1,
			duration: .35,
			frequency: 349,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .4,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}]
	},
	protective: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 900,
			volume: .18
		}],
		tones: [{
			startTime: .1,
			duration: .35,
			frequency: 349,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .15,
			duration: .4,
			frequency: 440,
			volume: .1,
			type: "sine",
			filterFrequency: 800
		}]
	},
	compassionate: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .12,
			duration: .32,
			frequency: 523,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	empathetic: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 440,
			volume: .15,
			type: "sine",
			filterFrequency: 800
		}, {
			startTime: .12,
			duration: .32,
			frequency: 523,
			volume: .12,
			type: "sine",
			filterFrequency: 800
		}]
	},
	conflicted: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 440,
			volume: .12,
			type: "sine",
			frequencyEnd: 494
		}, {
			startTime: .15,
			duration: .15,
			frequency: 466,
			volume: .1,
			type: "sine"
		}]
	},
	confused: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 440,
			volume: .12,
			type: "sine",
			frequencyEnd: 494
		}, {
			startTime: .15,
			duration: .15,
			frequency: 466,
			volume: .1,
			type: "sine"
		}]
	},
	ambivalent: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 440,
			volume: .12,
			type: "sine",
			frequencyEnd: 494
		}, {
			startTime: .15,
			duration: .15,
			frequency: 466,
			volume: .1,
			type: "sine"
		}]
	},
	nostalgic: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .15
		}],
		tones: [{
			startTime: .1,
			duration: .4,
			frequency: 440,
			volume: .12,
			type: "sine",
			filterFrequency: 500
		}, {
			startTime: .3,
			duration: .45,
			frequency: 392,
			volume: .1,
			type: "sine",
			filterFrequency: 450
		}]
	},
	guilty: {
		puffs: [{
			startTime: 0,
			duration: .25,
			frequency: 800,
			volume: .25
		}],
		tones: [{
			startTime: .08,
			duration: .3,
			frequency: 523,
			volume: .18,
			type: "sine",
			frequencyEnd: 349
		}]
	},
	embarrassed: {
		puffs: [
			{
				startTime: 0,
				duration: .05,
				frequency: 2e3,
				volume: .18
			},
			{
				startTime: .08,
				duration: .05,
				frequency: 2100,
				volume: .18
			},
			{
				startTime: .15,
				duration: .06,
				frequency: 2e3,
				volume: .16
			}
		],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 494,
			volume: .12,
			type: "sine"
		}]
	},
	surprised: {
		puffs: [{
			startTime: 0,
			duration: .06,
			frequency: 2800,
			volume: .25
		}],
		tones: [{
			startTime: .02,
			duration: .15,
			frequency: 659,
			volume: .2,
			type: "sine",
			frequencyEnd: 988
		}]
	},
	shocked: {
		puffs: [{
			startTime: 0,
			duration: .04,
			frequency: 3500,
			volume: .3
		}],
		tones: [{
			startTime: 0,
			duration: .08,
			frequency: 1047,
			volume: .25,
			type: "sine"
		}, {
			startTime: .05,
			duration: .15,
			frequency: 880,
			volume: .15,
			type: "sine"
		}]
	},
	awestruck: {
		puffs: [{
			startTime: 0,
			duration: .2,
			frequency: 1500,
			volume: .2
		}],
		tones: [
			{
				startTime: .08,
				duration: .4,
				frequency: 440,
				volume: .15,
				type: "sine"
			},
			{
				startTime: .1,
				duration: .38,
				frequency: 660,
				volume: .12,
				type: "sine"
			},
			{
				startTime: .12,
				duration: .36,
				frequency: 880,
				volume: .09,
				type: "sine"
			}
		]
	},
	skeptical: {
		puffs: [{
			startTime: 0,
			duration: .12,
			frequency: 1200,
			volume: .18
		}],
		tones: [{
			startTime: .04,
			duration: .2,
			frequency: 440,
			volume: .12,
			type: "sine",
			frequencyEnd: 494
		}, {
			startTime: .15,
			duration: .15,
			frequency: 466,
			volume: .1,
			type: "sine"
		}]
	}
}, s = class e {
	get theme() {
		return a.value.theme;
	}
	get volume() {
		return a.value.volume;
	}
	get muted() {
		return a.value.muted;
	}
	get themeName() {
		return this.theme?.name ?? "default";
	}
	constructor() {
		this.audioContext = null, this.theme$ = a.$.pipe(r((e) => e.theme), i(1)), this.volume$ = a.$.pipe(r((e) => e.volume), n(), i(1)), this.muted$ = a.$.pipe(r((e) => e.muted), n(), i(1)), this._themeName$ = new t("default"), this.themeName$ = this._themeName$.asObservable(), this.theme$.subscribe((e) => {
			this._themeName$.next(e?.name ?? "default");
		});
	}
	getContext() {
		if (!this.audioContext) {
			let e = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new e();
		}
		return this.audioContext.state === "suspended" && this.audioContext.resume(), this.audioContext;
	}
	playPuff(e, t, n) {
		let r = this.getContext(), i = Math.floor(r.sampleRate * t.duration), a = r.createBuffer(1, i, r.sampleRate), o = a.getChannelData(0);
		for (let e = 0; e < i; e++) o[e] = 2 * Math.random() - 1;
		let s = r.createBufferSource();
		s.buffer = a;
		let c = r.createBiquadFilter();
		c.type = "bandpass", c.frequency.value = t.frequency, c.Q.value = .7;
		let l = r.createGain();
		l.gain.setValueAtTime(0, e), l.gain.linearRampToValueAtTime(t.volume * n, e + .015), l.gain.exponentialRampToValueAtTime(.001, e + t.duration), s.connect(c).connect(l).connect(r.destination), s.start(e), s.stop(e + t.duration);
	}
	playTone(e, t, n) {
		let r = this.getContext(), i = r.createOscillator(), a = r.createGain();
		i.type = t.type, i.frequency.setValueAtTime(t.frequency, e), t.frequencyEnd && i.frequency.exponentialRampToValueAtTime(t.frequencyEnd, e + .8 * t.duration);
		let o = i;
		if (t.filterFrequency) {
			let e = r.createBiquadFilter();
			e.type = "lowpass", e.frequency.value = t.filterFrequency, i.connect(e), o = e;
		}
		a.gain.setValueAtTime(0, e), a.gain.linearRampToValueAtTime(t.volume * n, e + .02), a.gain.exponentialRampToValueAtTime(.001, e + t.duration), o.connect(a).connect(r.destination), i.start(e), i.stop(e + t.duration);
	}
	setTheme(e) {
		a.set({ theme: e });
	}
	resetTheme() {
		a.set({ theme: null });
	}
	setVolume(e) {
		a.set({ volume: Math.max(0, Math.min(1, e)) });
	}
	mute() {
		a.set({ muted: !0 });
	}
	unmute() {
		a.set({ muted: !1 });
	}
	toggleMute() {
		a.set({ muted: !this.muted });
	}
	getSoundForFeeling(e) {
		let t = this.theme;
		if (t?.feelings?.[e]) return t.feelings[e];
		if (t?.categoryDefaults) {
			let n = this.getCategoryForFeeling(e);
			if (t.categoryDefaults[n]) return t.categoryDefaults[n];
		}
		return o[e];
	}
	getCategoryForFeeling(e) {
		return [
			"joyful",
			"content",
			"excited",
			"proud",
			"hopeful",
			"relieved",
			"grateful",
			"peaceful",
			"playful",
			"amused",
			"curious",
			"inspired",
			"confident",
			"loved",
			"comforted",
			"energized",
			"celebrated"
		].includes(e) ? "happy" : [
			"sad",
			"lonely",
			"disappointed",
			"heartbroken",
			"grieving",
			"hopeless",
			"empty",
			"discouraged",
			"melancholic",
			"homesick",
			"hurt",
			"miserable",
			"regretful",
			"ashamed",
			"inferior"
		].includes(e) ? "sad" : [
			"anxious",
			"worried",
			"afraid",
			"terrified",
			"panicked",
			"nervous",
			"uneasy",
			"insecure",
			"overwhelmed",
			"stressed",
			"tense",
			"apprehensive",
			"startled",
			"suspicious",
			"vulnerable"
		].includes(e) ? "anxious" : [
			"annoyed",
			"irritated",
			"frustrated",
			"angry",
			"enraged",
			"bitter",
			"resentful",
			"jealous",
			"envious",
			"indignant",
			"impatient",
			"hostile",
			"contemptuous"
		].includes(e) ? "angry" : [
			"tired",
			"exhausted",
			"drained",
			"burnedOut",
			"numb",
			"bored",
			"unmotivated",
			"apathetic",
			"restless"
		].includes(e) ? "tired" : [
			"calm",
			"relaxed",
			"atEase",
			"balanced",
			"stable",
			"secure",
			"safe",
			"centered",
			"grounded",
			"accepting"
		].includes(e) ? "calm" : [
			"connected",
			"accepted",
			"included",
			"belonging",
			"appreciated",
			"valued",
			"respected",
			"supported",
			"protective",
			"compassionate",
			"empathetic"
		].includes(e) ? "connected" : "mixed";
	}
	play(e) {
		if (this.muted) return;
		let t = this.getSoundForFeeling(e), n = this.getContext().currentTime, r = this.theme?.masterVolume ?? 1, i = this.volume * r;
		t.puffs.forEach((e) => {
			this.playPuff(n + e.startTime, e, i);
		}), t.tones.forEach((e) => {
			this.playTone(n + e.startTime, e, i);
		});
	}
	dispose() {
		this.audioContext &&= (this.audioContext.close(), null);
	}
	static getInstance() {
		return e.instance ||= new e(), e.instance;
	}
}.getInstance(), c = s;
export { s as n, c as t };
