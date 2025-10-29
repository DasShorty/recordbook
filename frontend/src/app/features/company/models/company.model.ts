export type Company = {

  id: string,
  companyName: string,
  users: string[]

}

export type CompanyNameCheckResult = {
  searchedName: string,
  successful: boolean
}
