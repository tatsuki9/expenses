export namespace SystemConst {
  export namespace Error {
    export const USER_NOT_FOUND        = 1000;
    export const AUTHNETICATION_FAILED = 1001;
    export const ALREADY_USER_LEAVE    = 1002;
    export const ALREADY_USER_EXIST    = 1003;
  }
  export namespace PaymentType {
    export const SPEND  = 0;
    export const INCOME = 1;
  }
}

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
