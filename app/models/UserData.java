package models;

import play.*;
import play.data.validation.Match;
import play.data.validation.MaxSize;
import play.data.validation.MinSize;
import play.data.validation.Required;
import play.data.validation.Unique;
import play.data.validation.Validation;
import play.db.jpa.*;

import javax.persistence.*;

import java.util.*;

import org.apache.commons.lang3.RandomStringUtils;

import controllers.Hash;

@Entity
public class UserData extends Model{
    
	/**
	 * ユーザー名
	 */
	@Unique(message="そのユーザー名は既に使用されてます")
	@Required(message="入力してください")
    @Match(value="[a-zA-Z0-9_]*", message="ユーザー名は英数字と_のみ使えます")
    public String username;
	
	/**
	 * パスワード
	 */
    @Required(message="入力してください")
    @MinSize(value=4, message="パスワードは４文字以上でお願いします")
    @Match(value="[a-zA-Z0-9_]*", message="パスワードは英数字と_のみ使えます")
	public String password;
	
    /**
     * パスワードに付加するsalt
     */
	public String salt;
	
	@OneToMany(mappedBy="userdata",cascade=CascadeType.ALL)
	public List<History> histories = new ArrayList<History>();
	
	@OneToMany(mappedBy="userdata",cascade=CascadeType.ALL)
	public List<Word> words = new ArrayList<Word>();
	
    public UserData(String username) {
        this.username = username;
		this.salt=RandomStringUtils.randomAlphanumeric(16);
		this.TotalScore=0;
    }
    
    public int TotalScore;
    
    /**
     * パスワードをダイジェスト化する
     */
    public void digest_password(){
    	this.salt=RandomStringUtils.randomAlphanumeric(16);
    	this.password=getDigest(this.password, this.salt);
    }
    
    /**
     * 引数のパスワードが正しいかチェック
     * @param input_password 入力されたパスワード
     */
    public boolean check_password(String input_password){
    	String digest_password = getDigest(input_password, this.salt);
    	if( this.password.equals(digest_password) ){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    /**
     * ユーザー名、パスワードを引数に取りログインのチェックを行う。
     * @param username
     * @param password
     * @return boolean
     */
	public static boolean login_confirm(String username, String password){
		UserData user = UserData.find("username = ?", username).first();
		if(user == null){
			return false;
		}else if(!((user.password).equals(getDigest(password,user.salt)))){
			return false;
		}else{
			return true;
		}
	}

	/**
	 * ゲームの総合プレイ回数
	 * @return HashMap
	 */
	public HashMap<?,?> total_history(){
		List<History> histories = this.histories;
		HashMap<String,Double> total_history = new HashMap<String, Double>(){{
			put("play_count", 0.0);
			put("score", 0.0);
			put("time", 0.0);
			put("missCount", 0.0);
		}}; 
		for(History history : histories){
			total_history.put("play_count", total_history.get("play_count") + 1);
			total_history.put("score", total_history.get("score") + history.score);
			total_history.put("time", total_history.get("time") + history.time);
			total_history.put("missCount", total_history.get("missCount") + history.missCount);
		}
		/* 総合プレイ時間を小数点以下２桁までに丸める */
		double total_time = total_history.get("time");
		String rounded = String.format("%.2f", total_time);
		total_time = Double.parseDouble(rounded);
		total_history.put("time", total_time);
		
		return total_history;
	}
	
	private static String getDigest(String pass,String salt){
		Hash h = new Hash();
        String digest = h.getSHA256(pass+salt);
		return digest;
	}
	
}
