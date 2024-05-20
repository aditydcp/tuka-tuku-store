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

export const isNotLoggedIn = (auth: Session | null, isAdmin: boolean = false) => {
  if (isAdmin) {
    if (auth) {
      return auth.user?.role !== "admin"
    }
    return true
  } else if (auth) {
    return false
  } else {
    return true
  }
}
