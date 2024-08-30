let validation  = new JustValidate("#form",{
    errorLabelStyle: {
        color: "red",
        fontSize: "15px"
    }
})

validation.addField("#input", [
    {
        rule: "required",
        errorMessage: "Поле не заполнено"
    },
    {
        rule: "minLength",
        value: 4,
        errorMessage: "Минимум 4 символа"
    }
])


validation.addField("#input-email", [
    {
        rule: "required",
        errorMessage: "Поле не заполнено"
    },
    {
        rule: "minLength",
        value: 4,
        errorMessage: "Минимум 4 символа"
    },
    {
        rule: "email",
        errorMessage: "Неверно указан email"
    },

])
