export default class ApiResponse<T> {
  private data?: T
  private errorMessage?: string
  private statusCode: number

  constructor(props: {
    data?: T,
    statusCode: number,
    errorMessage?: string
  }) {
    this.data = props.data
    this.statusCode = props.statusCode
    this.errorMessage = props.errorMessage
  }

  wasSuccess = () => {
    const validStatus = [200, 201, 204]

    return validStatus.filter(status => status === this.statusCode).length > 0
  }

  result = () => {
    return this.data
  }
}