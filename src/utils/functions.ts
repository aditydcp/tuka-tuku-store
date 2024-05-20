type AnyFunction = (...args: any[]) => any

export const nullIfError = <Func extends AnyFunction>(func: Func) => 
  async (...args: Parameters<Func>) => {
    try {
      return await func(...args)
    } catch (error) {
      console.log(error)
      return null
    }
  }