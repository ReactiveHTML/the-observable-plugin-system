import iPlug from './index.ts'

describe('iPlug', () => {
	describe('Setup', () => {

		describe('when we pass a plugin', () => {
			it('makes it available for calling', async () => {
				const modules = {
					module1: () => ({ 'test:message': data => `hello ${data}` }),
				}
				const plugins = await iPlug(modules)
				expect(plugins.serial('test:message', 'world')).toBe('hello world')
			})

			describe('if it\'s exported as a function that returns a manifest object', () => {
				it('executes it', async () => {
					const modules = {
						module1: () => ({ 'test:message': data => `hello` }),
					}
					const plugins = await iPlug(modules)
					expect(plugins('test:message', '0')).toBe('hello')
				})

				it('passes a moduleConfig parameter', async () => {
					const moduleConfig = 'xxx123'
					const modules = {
						module1: { 'test:message': () => moduleConfig },
					}
					const plugins = await iPlug(modules, moduleConfig)
					expect(plugins('test:message', '0')).toBe(moduleConfig)
				})
			})
		})
	})

	describe('Calling plugins', () => {
		describe('when we call plugins in sequence', () => {

			it('returns a single item', async () => {
				const modules = {
					module1: { 'test': data => 1 },
					module2: { 'test': data => 2 },
					module3: { 'test': data => 3 },
				}
				const plugins = await iPlug(modules)
				expect(plugins.serial('test')).toEqual(3)
			})

			it('calls them in order', async () => {
				const initialData = 'initial-data'
				const output1 = 'hello from module1'
				const output2 = 'hello from module2'
				const modules = {
					module1: { 'test:message': data => `${data}${output1}` },
					module2: { 'test:message': data => `${data}${output2}` },
				}
				const plugins = await iPlug(modules)
				expect(plugins('test:message', initialData)).toBe(`${initialData}${output1}${output2}`)
			})

			describe('When no plugin is actually defined', () => {
				it('returns the initial data, unchanged', async () => {
					const modules = {
					}
					const initialData = 'initial-data'
					const plugins = await iPlug(modules)

					expect(plugins.serial('test', initialData)).toEqual(initialData)
				})
			})

			describe('When no plugin is actually called/interested', () => {
				it('returns the initial data, unchanged', async () => {
					const modules = {
						module1: { 'other:topic': config => data => 'other-stuff' },
						module2: { 'other:topic': config => data => 'other-stuff' },
					}
					const initialData = 'initial-data'
					const plugins = await iPlug(modules)

					expect(plugins.serial('test', initialData)).toEqual(initialData)
				})
			})

			describe('When a plugin doesn`t register for an event', () => {
				it('it`s treated as if didn`t exist', async () => {
					const output1 = 'hello from module1'
					const output3 = 'hello from module3'
					const modules = {
						interested1: { 'test:message': data => `${data}-interested1` },
						notInterested1: { 'test:message': undefined },
						interested2: { 'test:message': data => `${data}-interested2`},
						notInterested2: { 'test:message': undefined },
						notInterested3: { 'test:message': undefined },
					}
					const plugins = await iPlug(modules)
					const result = plugins
						.serial('test:message', 'initial')

					expect(result).toEqual('initial-interested1-interested2')
				})
			})

		})

		describe('when we call plugins in parallel', () => {

			it('returns an array of results', async () => {
				const modules = {
					module1: { 'test': data => 1 },
					module2: { 'test': data => 2 },
					module3: { 'test': data => 3 },
				}
				const plugins = await iPlug(modules)
				expect(plugins.parallel('test')).toEqual([1, 2, 3])
			})

			it('calls them in order', async () => {
				const modules = {
					module1: { 'test:message': data => `${data}-1` },
					module2: { 'test:message': data => `${data}-2` },
				}
				const plugins = await iPlug(modules)
				expect(plugins.parallel('test:message', '0')).toEqual(['0-1', '0-2'])
			})

			describe('When no plugin is defined', () => {
				it('returns an empty array', async () => {
					const modules = {
					}
					const initialData = 'xxx12345'
					const plugins = await iPlug(modules)

					expect(plugins.parallel('test', initialData)).toEqual([])
				})
			})

			describe('When no plugin is actually called', () => {
				it('returns an empty array', async () => {
					const modules = {
						module1: { 'no:matching:message': data => 99999 },
						module2: { 'no:matching:message': data => 99999 },
					}
					const initialData = 'xxx12345'
					const plugins = await iPlug(modules)

					expect(plugins.parallel('test', initialData)).toEqual([])
				})
			})

			describe('When a plugin doesn`t register for an event', () => {
				it('it`s treated as if didn`t exist', async () => {
					const output1 = 'hello from module1'
					const output3 = 'hello from module3'
					const modules = {
						module1: { 'test:message': data => output1 },
						module2: { 'test:message': undefined },
						module3: { 'test:message': data => output3},
					}
					const plugins = await iPlug(modules)

					expect(plugins.parallel('test:message')).toEqual([output1, output3])
				})
			})

		})

	})
})

