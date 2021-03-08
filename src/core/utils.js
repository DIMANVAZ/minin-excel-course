//Pure functions - независимая функция, не взаимодействующая с глобальными переменными
// а берущая какие-то входные данные и выдающая результат

export function capitalize(string) {
    if(typeof string !== 'string') {
        return ''
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}