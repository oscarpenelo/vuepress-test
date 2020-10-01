# Text255 and Text32k encodings<a name="c_Text255_encoding"></a>

Text255 and text32k encodings are useful for compressing VARCHAR columns in which the same words recur often\. A separate dictionary of unique words is created for each block of column values on disk\. \(An Amazon Redshift disk block occupies 1 MB\.\) The dictionary contains the first 245 unique words in the column\. Those words are replaced on disk by a one\-byte index value representing one of the 245 values, and any words that are not represented in the dictionary are stored uncompressed\. The process repeats for each 1 MB disk block\. If the indexed words occur frequently in the column, the column will yield a high compression ratio\.

For the text32k encoding, the principle is the same, but the dictionary for each block does not capture a specific number of words\. Instead, the dictionary indexes each unique word it finds until the combined entries reach a length of 32K, minus some overhead\. The index values are stored in two bytes\.

For example, consider the VENUENAME column in the VENUE table\. Words such as **Arena**, **Center**, and **Theatre** recur in this column and are likely to be among the first 245 words encountered in each block if text255 compression is applied\. If so, this column will benefit from compression because every time those words appear, they will occupy only 1 byte of storage \(instead of 5, 6, or 7 bytes, respectively\)\.