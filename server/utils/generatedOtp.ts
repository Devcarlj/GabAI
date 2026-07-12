const generatedOtp = (): number => {
    return Math.floor(Math.random() * 900000) + 100000; // range: 100000 to 999999
};

export default generatedOtp;