<?php 

// each army created gets a unique flag name and a unit of soliders of various sizes

class Army {

	private $soldiers;
	private $numSoldiers;
	private static $MIN_SOLDIERS = 15; 
	private static $MAX_SOLDIERS = 25;

	public function __construct(Flag $flag = null, Soldier $soldier = null) {

        $this->flag = new Flag();
        $this->numSoldiers = $this->getUnitOfSoldiers();
        $this->soldier = new Soldier($this->numSoldiers); 
        $this->buildSoldiers();
        return;
    }

    public function getUnitOfSoldiers() {
    	$this->numSoldiers = rand(self::$MIN_SOLDIERS, self::$MAX_SOLDIERS);
    	return $this->numSoldiers;
    }

    public function getName($flagsTaken) {
    	$flagsLeft = array();
    	$flags = $this->flag->getFlags();

    	// return a flag that's not been used
    	for ($i = 0; $i < count($flags); $i++) {
    		if (!in_array($flags[$i], $flagsTaken)) {
    		    array_push($flagsLeft, $flags[$i]);
    		}
    	} 

    	// TODO: add error handling here for when there are no more flags available

    	shuffle($flagsLeft);
		$newFlag = array_pop($flagsLeft);
		return $newFlag;
    }

    public function buildSoldiers() {
    	$this->soldiers = array();
    	for ($i = 0; $i < $this->numSoldiers; $i++) {
    		$this->soldiers[$i] = $this->soldier->getSizes()[$i];
    	}
    }
}