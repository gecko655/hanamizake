//授業で配布されもの

package controllers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Hash{

    /**
     * バイト列を16進の文字列に変換する．
     */
    public static String bytesToHexString(byte[] bytes) {
        final StringBuffer sb = new StringBuffer();
        for (final byte b: bytes) {
            final String s = Integer.toHexString(0xff & b);
            sb.append(s.length() == 1 ? "0" + s : s);
        }
        return sb.toString();
    }

    /**
     * 文字列をバイト列とみなし，そのSHA256値を計算する．
     */
    public static String getSHA256(String s) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            final byte[] bytes = s.getBytes();
            digest.update(bytes, 0, bytes.length);

            return bytesToHexString(digest.digest());
        }
        catch (final NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return null;
    }
}
