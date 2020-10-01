# AWS Encryption SDK algorithms reference<a name="algorithms-reference"></a>


|  | 
| --- |
|  The information on this page is a reference for building your own encryption library that is compatible with the AWS Encryption SDK\. If you are not building your own compatible encryption library, you likely do not need this information\. To use the AWS Encryption SDK in one of the supported programming languages, see [Programming languages](programming-languages.md)\. For the specification that defines the elements of a proper AWS Encryption SDK implementation, see the *AWS Encryption SDK Specification* in the [aws\-encryption\-sdk\-specification](https://github.com/awslabs/aws-encryption-sdk-specification/) repository in GitHub\.  | 

If you are building your own library that can read and write ciphertexts that are compatible with the AWS Encryption SDK, you'll need to understand how the AWS Encryption SDK implements the supported algorithm suites to encrypt raw data\. 

The AWS Encryption SDK supports the following algorithm suites\. All AES\-GCM algorithm suites have a 12\-byte [initialization vector](IV-reference.md) and a 16\-byte AES\-GCM authentication tag\. The default algorithm suite varies with the AWS Encryption SDK version and the selected key commitment policy\. For details, see [Commitment policy and algorithm suite](troubleshooting-migration.md#configuration-conflict_1)\.


**AWS Encryption SDK Algorithm Suites**  

| Algorithm ID | Message format version | Encryption algorithm | Data key length \(bits\) | Key derivation algorithm | Signature algorithm | Key commitment algorithm | Algorithm suite data length \(bytes\) | 
| --- | --- | --- | --- | --- | --- | --- | --- | 
| 05 78 | 0x02 | AES\-GCM | 256 | HKDF with SHA\-512 | ECDSA with P\-384 and SHA\-384 | HKDF with SHA\-512 | 32 \(key commitment\) | 
| 04 78 | 0x02 | AES\-GCM | 256 | HKDF with SHA\-512 | None | HKDF with SHA\-512 | 32 \(key commitment\) | 
| 03 78 | 0x01 | AES\-GCM | 256 | HKDF with SHA\-384 | ECDSA with P\-384 and SHA\-384 | None | N/A | 
| 03 46 | 0x01 | AES\-GCM | 192 | HKDF with SHA\-384 | ECDSA with P\-384 and SHA\-384 | None | N/A | 
| 02 14 | 0x01 | AES\-GCM | 128 | HKDF with SHA\-256 | ECDSA with P\-256 and SHA\-256 | None | N/A | 
| 01 78 | 0x01 | AES\-GCM | 256 | HKDF with SHA\-256 | None | None | N/A | 
| 01 46 | 0x01 | AES\-GCM | 192 | HKDF with SHA\-256 | None | None | N/A | 
| 01 14 | 0x01 | AES\-GCM | 128 | HKDF with SHA\-256 | None | None | N/A | 
| 00 78 | 0x01 | AES\-GCM | 256 | None | None | None | N/A | 
| 00 46 | 0x01 | AES\-GCM | 192 | None | None | None | N/A | 
| 00 14 | 0x01 | AES\-GCM | 128 | None | None | None | N/A | 

**Algorithm ID**  
A 2\-byte hexadecimal value that uniquely identifies an algorithm implementation\. This value is stored in the [message header](message-format.md#header-structure) of the ciphertext\.

**Message format version**  
The version of the message format\. Algorithm suites with key commitment use message format version 2 \(0x02\)\. Algorithm suites without key commitment use message format version 1 \(0x01\)\. 

**Algorithm suite data length**  
The length in bytes of data specific to the algorithm suite\. This field is supported only in message format version 2 \(0x02\)\. In message format version 2 \(0x02\), this data appears in the `Algorithm suite data` field of the message header\. Algorithm suites that support [key commitment](concepts.md#key-commitment) use 32 bytes for the key commitment string\. For more information, see **Key commitment algorithm** in this list\.

**Data key length**  
The length of the [data key](concepts.md#DEK) in bits\. The AWS Encryption SDK supports 256\-bit, 192\-bit, and 128\-bit keys\. The data key is generated by a [keyring](concepts.md#keyring) or master key\.   
In some implementations, this data key is used as input to an HMAC\-based extract\-and\-expand key derivation function \(HKDF\)\. The output of the HKDF is used as the data encryption key in the encryption algorithm\. For more information, see **Key derivation algorithm** in this list\.

**Encryption algorithm**  
The name and mode of the encryption algorithm used\. Algorithm suites in the AWS Encryption SDK use the Advanced Encryption Standard \(AES\) encryption algorithm with Galois/Counter Mode \(GCM\)\.

**Key commitment algorithm**  
The algorithm used to calculate the key commitment string\. The output is stored in the `Algorithm suite data` field of the message header and is used to validate the data key for key commitment\.  
For a technical explanation of adding key commitment to an algorithm suite, see [Key Committing AEADs](https://eprint.iacr.org/2020/1153) in Cryptology ePrint Archive\. 

**Key derivation algorithm**  
The HMAC\-based extract\-and\-expand key derivation function \(HKDF\) used to derive the data encryption key\. The AWS Encryption SDK uses the HKDF defined in [RFC 5869](https://tools.ietf.org/html/rfc5869)\.   
**Algorithm suites without key commitment** \(algorithm ID `01xx` – `03xx`\)  
+ The hash function used is either SHA\-384 or SHA\-256, depending on the algorithm suite\.
+ For the extract step:
  + No salt is used\. Per the RFC, the salt is set to a string of zeros\. The string length is equal to the length of the hash function output, which is 48 bytes for SHA\-384 and 32 bytes for SHA\-256\.
  + The input keying material is the data key from the keyring or master key provider\.
+ For the expand step:
  + The input pseudorandom key is the output from the extract step\.
  + The input info is a concatenation of the algorithm ID and message ID \(in that order\)\.
  + The length of the output keying material is the **Data key length**\. This output is used as the data encryption key in the encryption algorithm\.
**Algorithm suites with key commitment** \(algorithm ID `04xx` and `05xx`\)  
+ The hash function used is SHA\-512\.
+ For the extract step:
  + The salt is a 256\-bit cryptographic random value\. In [message format version 2](message-format.md) \(0x02\), this value is stored in the `MessageID` field\.
  + The initial keying material is the data key from the keyring or master key provider\.
+ For the expand step:
  + The input pseudorandom key is the output from the extract step\.
  + The key label is the UTF\-8\-encoded bytes of the `DERIVEKEY` string in big endian byte order\.
  + The input info is a concatenation of the algorithm ID and the key label \(in that order\)\.
  + The length of the output keying material is the **Data key length**\. This output is used as the data encryption key in the encryption algorithm\.

**Message format version**  
The version of the message format used with the algorithm suite\. For details, see [Message format reference](message-format.md)\.

**Signature algorithm**  
The signature algorithm used to generate a signature over the ciphertext header and body\. The AWS Encryption SDK uses the Elliptic Curve Digital Signature Algorithm \(ECDSA\) with the following specifics:  
+ The elliptic curve used is either the P\-384 or P\-256 curve, as specified by the algorithm ID\. These curves are defined in [Digital Signature Standard \(DSS\) \(FIPS PUB 186\-4\)](http://doi.org/10.6028/NIST.FIPS.186-4)\.
+ The hash function used is SHA\-384 \(with the P\-384 curve\) or SHA\-256 \(with the P\-256 curve\)\.