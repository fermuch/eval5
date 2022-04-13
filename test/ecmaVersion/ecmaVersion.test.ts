import { Interpreter } from "../../src";

test("es3", () => {
	let hasError = false;
	const interpreter = new Interpreter(
		{},
		{
			ecmaVersion: 3,
		}
	);
	try {
		interpreter.evaluate(
			`
        var data = {
            _value: 4,
            get value(){
                return this._value;
            }
        }
  `
		);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toEqual(true);
});

test("es5 -1", () => {
	let hasError = false;
	const interpreter = new Interpreter(
		{},
		{
			ecmaVersion: 5,
		}
	);
	try {
		interpreter.evaluate(
			`
        var data = {
            _value: 4,
            get value(){
                return this._value;
            }
        }
  `
		);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toEqual(false);
});

test("es5 -2", () => {
	let hasError = false;
	const interpreter = new Interpreter(
		{},
		{
			ecmaVersion: 5,
		}
	);
	try {
		interpreter.evaluate(
			`
        let i = 1;
  `
		);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toEqual(true);
});

test("es2021", () => {
	let hasError = false;
	const interpreter = new Interpreter(
		{},
		{
			ecmaVersion: 2021,
			globalContextInFunction: {
				setTimeout: setTimeout,
			},
		}
	);


	try {
		interpreter.evaluate(
			`
        const i = 1_000_000_000;
  		`
		);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toEqual(false);


	let ret: any = null;
	try {
		ret = interpreter.evaluate(
			`
				'xxx'.replaceAll('x', '_');
  		`
		);
	} catch (e) {
		hasError = true;
	}

	expect(ret).toBe('___');
	expect(hasError).toEqual(false);


	ret = null;
	try {
		ret = interpreter.evaluate(
			`
				async function f() {
					// await new Promise(resolve => {setTimeout(resolve, 0)});
					await new Promise(res => res());
					return 42;
				}
				f();
  		`
		);
	} catch (e) {
		console.error(e);
		hasError = true;
	}

	expect(hasError).toEqual(false);
	expect(ret).toBe(42);

	ret = null;
	try {
		ret = interpreter.evaluate(
			`
			const car = {
				model: 'Fiesta',
				manufacturer: 'Ford',
				fullName: function() {
					return \`\${this.manufacturer} \${this.model}\`
				}
			};
			car.fullName();
			`
		);
	} catch (e) {
		console.error(e);
		hasError = true;
	}

	expect(hasError).toEqual(false);
	expect(ret).toBe('Ford Fiesta');

	ret = null;
	try {
		ret = interpreter.evaluate(
			`
			const car = {
				model: 'Fiesta',
				manufacturer: 'Ford',
				fullName: () => {
					return \`\${this.manufacturer} \${this.model}\`
				}
			};
			car.fullName();
			`
		);
	} catch (e) {
		console.error(e);
		hasError = true;
	}

	expect(hasError).toEqual(false);
	expect(ret).toBe('undefined undefined');
});
