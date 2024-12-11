function model(Sequelize, connection) {
    const User = connection.define("user", {
        no: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id: {
            type: Sequelize.STRING,
            // unique: true
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

    const Group = connection.define("group", {
        no: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING  // 제목
        },
        language: {
            type: Sequelize.STRING  // 사용 언어
        },
        members: {
            type: Sequelize.INTEGER  // 현재 인원
        },
        capacity: {
            type: Sequelize.INTEGER  // 모집 인원
        },
        meetingFrequency: {
            type: Sequelize.STRING  // 미팅 빈도
        },
        description: {
            type: Sequelize.TEXT  // 세부 내용
        },
        methodology: {
            type: Sequelize.STRING  // 공부 방법 (스터디 그룹 전용)
        },
        photo: {
            type: Sequelize.BLOB('long') // 첨부 사진 파일 (BLOB 타입으로 설정)
        },
        writer: {
            type: Sequelize.STRING
        },
        writeDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    const Job = connection.define("job", {
        no: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING  // 제목
        },
        language: {
            type: Sequelize.STRING  // 사용 언어
        },
        members: {
            type: Sequelize.INTEGER  // 현재 인원
        },
        capacity: {
            type: Sequelize.INTEGER  // 모집 인원
        },
        meetingFrequency: {
            type: Sequelize.STRING  // 미팅 빈도
        },
        description: {
            type: Sequelize.TEXT  // 세부 내용
        },
        salary: {
            type: Sequelize.STRING  // 월급 (채용 공고 전용)
        },
        photo: {
            type: Sequelize.BLOB('long') // 첨부 사진 파일 (BLOB 타입으로 설정)
        },
        writer: {
            type: Sequelize.STRING
        },
        writeDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    connection.sync({
        alter: true
    })
}

module.exports = model;
