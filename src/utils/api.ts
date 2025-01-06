import queryString from 'query-string';

export const sendRequestJS = async <T>(props: IRequest) => {
    let {
        url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {}
    } = props;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: body ? JSON.stringify(body) : null,
        ...nextOption,
    }
    if (useCredentials) {
        options.credentials = 'include';
    }
    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }
    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? "",

                } as T;
            })
        }
    }

    )
}


export const sendRequestFile = async <T>(props: IRequest) => {
    let {
        url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {}
    } = props;
    const options = {
        method: method,
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption,
    }
    if (useCredentials) {
        options.credentials = 'include';
    }
    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }
    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? "",

                } as T;
            })
        }
    }

    )
}

export const fetchDefaultImages = (type: string) => {
    if (type === "GITHUB") return "/user/default-github.png";
    if (type === "GOOGLE") return "/user/default-google.png";
    // if (type === "SYSTEM") return "/user/default-user.png";
    return "/user/default-user.png"
}