export type Company = {

  id: string,
  name: string,
  users: string[]

}

export type CompanyNameCheckResult = {
  searchedName: string,
  successful: boolean
}
