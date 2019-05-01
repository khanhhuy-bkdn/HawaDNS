using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace _Common.Runtime.Security
{
    public class GMCSecurity
    {
        public static GMCSecurity Instance { get; }

        #region enums, constants & fields
        public enum CryptoTypes
        {
            encTypeDES = 0,
            encTypeRC2,
            encTypeRijndael,
            encTypeTripleDES
        }

        private const string CRYPT_DEFAULT_PASSWORD = "namtrung";
        private const CryptoTypes CRYPT_DEFAULT_METHOD = CryptoTypes.encTypeRijndael;

        private byte[] mKey = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 };
        private byte[] mIV = { 65, 110, 68, 26, 69, 178, 200, 219 };
        private byte[] SaltByteArray = { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 };
        private CryptoTypes mCryptoType = CRYPT_DEFAULT_METHOD;
        private string mPassword = CRYPT_DEFAULT_PASSWORD;
        #endregion

        #region Properties
        public CryptoTypes CryptoType
        {
            get { return mCryptoType; }

            set
            {
                if (mCryptoType != value)
                {
                    mCryptoType = value;
                    calculateNewKeyAndIV();
                }
            }
        }

        public string Password
        {
            get { return mPassword; }

            set
            {
                if (mPassword != value)
                {
                    mPassword = value;
                    calculateNewKeyAndIV();
                }
            }
        }

        public byte[] Key
        {
            get { return mKey; }
            set { mKey = value; }
        }
        #endregion

        #region Constructors
        public GMCSecurity()
        {
            calculateNewKeyAndIV();
        }

        public GMCSecurity(CryptoTypes CryptoType)
        {
            this.CryptoType = CryptoType;
        }

        static GMCSecurity()
        {
            Instance = new GMCSecurity();
        }
        #endregion

        #region Encryption
        public void InitIV()
        {
            SymmetricAlgorithm algo = SelectAlgorithm();
            mIV = new byte[algo.BlockSize / 8];
            for (int i = 0; i < mIV.Length; i++)
            {
                mIV[i] = 0;
            }
        }

        public string Encrypt(string inputText)
        {
            UTF8Encoding UTF8Encoder = new UTF8Encoding();
            byte[] inputBytes = UTF8Encoder.GetBytes(inputText);
            return Convert.ToBase64String(EncryptDecrypt(inputBytes, true));
        }

        public string Encrypt(string inputText, string password)
        {
            Password = password;
            return Encrypt(inputText);
        }

        public string Encrypt(string inputText, string password, CryptoTypes cryptoType)
        {
            mCryptoType = cryptoType;
            Password = password;
            return Encrypt(inputText);
        }
        #endregion

        public byte[] Encrypt(byte[] input)
        {
            return EncryptDecrypt(input, true);
        }

        public byte[] Decrypt(byte[] input)
        {
            return EncryptDecrypt(input, false);
        }

        #region Decryption
        public string Decrypt(string inputText)
        {
            UTF8Encoding UTF8Encoder = new UTF8Encoding();
            byte[] inputBytes = Convert.FromBase64String(inputText);
            return UTF8Encoder.GetString(EncryptDecrypt(inputBytes, false));
        }

        public string Decrypt(string inputText, string password)
        {
            Password = password;
            return Decrypt(inputText);
        }

        public string Decrypt(string inputText, string password, CryptoTypes cryptoType)
        {
            mCryptoType = cryptoType;
            Password = password;
            return Decrypt(inputText);
        }
        #endregion

        #region Symmetric Engine
        private byte[] EncryptDecrypt(byte[] inputBytes, bool Encrpyt)
        {
            ICryptoTransform transform = GetCryptoTransform(Encrpyt);
            MemoryStream memStream = new MemoryStream();

            try
            {
                CryptoStream cryptStream = new CryptoStream(memStream, transform, CryptoStreamMode.Write);

                cryptStream.Write(inputBytes, 0, inputBytes.Length);

                cryptStream.FlushFinalBlock();

                byte[] output = memStream.ToArray();

                cryptStream.Close();

                return output;
            }
            catch (Exception e)
            {
                throw new Exception("Error in symmetric engine. Error : " + e.Message, e);
            }
        }

        private ICryptoTransform GetCryptoTransform(bool encrypt)
        {
            SymmetricAlgorithm SA = SelectAlgorithm();
            SA.Key = mKey;
            SA.IV = mIV;
            if (encrypt)
            {
                return SA.CreateEncryptor();
            }
            else
            {
                return SA.CreateDecryptor();
            }
        }

        private SymmetricAlgorithm SelectAlgorithm()
        {
            SymmetricAlgorithm SA;
            switch (mCryptoType)
            {
                case CryptoTypes.encTypeDES:
                    SA = DES.Create();
                    break;
                case CryptoTypes.encTypeRC2:
                    SA = RC2.Create();
                    break;
                case CryptoTypes.encTypeRijndael:
                    SA = Rijndael.Create();
                    break;
                case CryptoTypes.encTypeTripleDES:
                    SA = TripleDES.Create();
                    break;
                default:
                    SA = TripleDES.Create();
                    break;
            }

            return SA;
        }

        private void calculateNewKeyAndIV()
        {
            PasswordDeriveBytes pdb = new PasswordDeriveBytes(mPassword, SaltByteArray);
            SymmetricAlgorithm algo = SelectAlgorithm();
            mKey = pdb.GetBytes(algo.KeySize / 8);
            mIV = pdb.GetBytes(algo.BlockSize / 8);
        }

        public void CalculateRandomKeyAndIv(CryptoTypes cryptoType)
        {
            CryptoType = cryptoType;

            byte[] random = new byte[5];
            (new RNGCryptoServiceProvider()).GetNonZeroBytes(random);
            mPassword = Convert.ToBase64String(random);

            int saltStrength = Math.Max(32 - mPassword.Length, 0);

            byte[] buff = new byte[saltStrength];
            (new RNGCryptoServiceProvider()).GetBytes(buff);
            SaltByteArray = buff;

            PasswordDeriveBytes pdb = new PasswordDeriveBytes(mPassword, SaltByteArray);
            SymmetricAlgorithm algo = SelectAlgorithm();

            mKey = pdb.GetBytes(algo.KeySize / 8);

            mIV = new byte[algo.BlockSize / 8];

            for (int i = 0; i < mIV.Length; i++)
            {
                mIV[i] = 0;
            }
        }
        #endregion
    }
}