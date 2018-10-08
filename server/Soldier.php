<?php 

// returns a unit of soldier sizes, the amount defined by the calling class (see constructor)

class Soldier {

	private $sizes;
	private $numSoldiers;
	private static $MIN_SIZE = 10; 
	private static $MAX_SIZE = 90;

	public function __construct($howManySoldiers) {
        $this->numSoldiers = $howManySoldiers;
        return;
    }
	
	public function getSizes() {
		$this->sizes = array();

		for ($i = 0; $i < $this->numSoldiers; $i++) {
            $this->sizes[$i] = rand(self::$MIN_SIZE, self::$MAX_SIZE);
		}

		return $this->sizes;
	}
}