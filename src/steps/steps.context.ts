import { createContext } from '@lit/context'
import { BehaviorSubject } from 'rxjs'

export class StepsController {
	private _currentStep = new BehaviorSubject(1)

	get currentStep$() {
		return this._currentStep.asObservable()
	}

	get currentStep() {
		return this._currentStep.value
	}

	setStep(step: number) {
		this._currentStep.next(step)
	}
}

/**
 * The actual context object. We provide/consume this in the container and steps.
 */
export const stepsContext = createContext<StepsController>(Symbol('SchmancyStepsContext'))
