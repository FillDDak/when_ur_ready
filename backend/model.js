function model(Sequelize, connection) {
    const User = connection.define("user", {
        no: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        birthDate: {
            type: Sequelize.STRING // 문자열로 처리 (예: 'YYYYMMDD' 형식), 또는 Sequelize.DATE로 변경 가능
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        phoneNumber: {
            type: Sequelize.STRING, // 전화번호는 문자열로 처리
            allowNull: false
        },
        desiredJobField: {
            type: Sequelize.STRING,
            allowNull: false
        },
        experienceLevel: {
            type: Sequelize.STRING,
            allowNull: false
        },
        interviewStatus: {
            type: Sequelize.STRING,
            allowNull: false
        },
        targetCompany: {
            type: Sequelize.STRING,
            allowNull: false
        },
        interviewExperience: {
            type: Sequelize.STRING, // Enum으로 설정할 수도 있음
            allowNull: false
        },
        isOver15: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        termsAgreement: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        privacyAgreement: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        marketingConsent: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        profileImagePath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        joinDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    connection.sync({
        alter: true
    })
}

module.exports = model;
